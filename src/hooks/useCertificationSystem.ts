import { useState, useEffect, useCallback } from 'react';
import { externalSupabase } from '@/integrations/supabase/externalClient';
import { useAuth } from '@/auth';
import { toast } from 'sonner';

interface CertificationProgress {
  productId: string;
  productName: string;
  courseProgress: number;
  examsCompleted: number;
  examsPassed: number;
  averageScore: number;
  isEligibleForCertificate: boolean;
  hasCertificate: boolean;
  certificateId?: string;
}

interface ExamResult {
  examId: string;
  examTitle: string;
  score: number;
  passed: boolean;
  completedAt: string;
}

interface Enrollment {
  id: string;
  product_id: string;
  progress_percent: number;
  product: { id: string; name: string } | null;
}

interface ExamAttempt {
  id: string;
  exam_id: string;
  score: number | null;
  passed: boolean;
  completed_at: string;
  exam: { title: string } | null;
}

interface Certificate {
  id: string;
  product_id: string;
}

export function useCertificationSystem() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<CertificationProgress[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);

  const fetchProgress = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch enrollments with products
      const { data: enrollmentsData } = await externalSupabase
        .from('enrollments')
        .select(`
          id,
          product_id,
          progress_percent,
          product:products(id, name)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active');

      const enrollments = (enrollmentsData || []) as unknown as Enrollment[];

      // Fetch exam attempts
      const { data: attemptsData } = await externalSupabase
        .from('exam_attempts')
        .select(`
          id,
          exam_id,
          score,
          passed,
          completed_at,
          exam:financial_exams(title)
        `)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });

      const attempts = (attemptsData || []) as unknown as ExamAttempt[];

      // Fetch existing certificates
      const { data: certificatesData } = await externalSupabase
        .from('course_certificates')
        .select('id, product_id')
        .eq('user_id', user.id);

      const certificates = (certificatesData || []) as unknown as Certificate[];
      const certMap = new Map(certificates.map(c => [c.product_id, c.id]));

      // Process enrollments
      const progressData: CertificationProgress[] = enrollments.map(enrollment => {
        const product = Array.isArray(enrollment.product) 
          ? enrollment.product[0] 
          : enrollment.product;
        
        // Filter exam attempts for this product's related exams
        const relatedAttempts = attempts.filter(a => a.passed);
        const avgScore = relatedAttempts.length > 0
          ? relatedAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / relatedAttempts.length
          : 0;

        return {
          productId: enrollment.product_id,
          productName: product?.name || 'Curso',
          courseProgress: enrollment.progress_percent || 0,
          examsCompleted: relatedAttempts.length,
          examsPassed: relatedAttempts.filter(a => a.passed).length,
          averageScore: Math.round(avgScore),
          isEligibleForCertificate: (enrollment.progress_percent || 0) >= 100,
          hasCertificate: certMap.has(enrollment.product_id),
          certificateId: certMap.get(enrollment.product_id)
        };
      });

      // Process exam results
      const resultsData: ExamResult[] = attempts.map(attempt => ({
        examId: attempt.exam_id,
        examTitle: attempt.exam?.title || 'Exame',
        score: attempt.score || 0,
        passed: attempt.passed || false,
        completedAt: attempt.completed_at || ''
      }));

      setProgress(progressData);
      setExamResults(resultsData);
    } catch (error) {
      console.error('Error fetching certification progress:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const generateCertificate = async (productId: string, studentName?: string) => {
    if (!user) return null;

    try {
      // Check if already has certificate
      const { data: existingData } = await externalSupabase
        .from('course_certificates')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();

      const existing = existingData as { id: string } | null;

      if (existing) {
        toast.info('Certificado já foi emitido para este curso');
        return existing.id;
      }

      // Get product info
      const { data: productData } = await externalSupabase
        .from('products')
        .select('name')
        .eq('id', productId)
        .single();

      const product = productData as { name: string } | null;

      // Get profile name
      const { data: profileData } = await externalSupabase
        .from('profiles')
        .select('name, display_name')
        .eq('user_id', user.id)
        .single();

      const profile = profileData as { name?: string; display_name?: string } | null;

      // Calculate course hours from lessons
      const { data: lessonsData } = await externalSupabase
        .from('product_lessons')
        .select('video_duration, module:product_modules!inner(product_id)')
        .eq('module.product_id', productId);

      const lessons = (lessonsData || []) as unknown as Array<{ video_duration: number | null }>;
      const totalMinutes = lessons.reduce((acc, l) => acc + ((l.video_duration || 0) / 60), 0);
      const courseHours = Math.max(1, Math.round(totalMinutes / 60));

      // Get average exam score
      const { data: attemptsData } = await externalSupabase
        .from('exam_attempts')
        .select('score')
        .eq('user_id', user.id)
        .eq('passed', true);

      const attemptsArr = (attemptsData || []) as unknown as Array<{ score: number | null }>;
      const avgScore = attemptsArr.length > 0
        ? Math.round(attemptsArr.reduce((sum, a) => sum + (a.score || 0), 0) / attemptsArr.length)
        : 100;

      // Generate codes
      const certNumber = `SKY-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const valCode = Math.random().toString(36).substring(2, 10).toUpperCase();

      // Create certificate
      const { data: newCertData, error } = await externalSupabase
        .from('course_certificates')
        .insert({
          user_id: user.id,
          product_id: productId,
          student_name: studentName || profile?.name || profile?.display_name || user.email?.split('@')[0] || 'Aluno',
          course_name: product?.name || 'Curso',
          course_hours: courseHours,
          final_score: avgScore,
          certificate_number: certNumber,
          validation_code: valCode,
          issued_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      const newCert = newCertData as { id: string };

      toast.success('🎓 Certificado gerado com sucesso!');
      fetchProgress();
      
      return newCert.id;
    } catch (error: any) {
      console.error('Error generating certificate:', error);
      toast.error('Erro ao gerar certificado: ' + error.message);
      return null;
    }
  };

  return {
    loading,
    progress,
    examResults,
    generateCertificate,
    refresh: fetchProgress
  };
}
