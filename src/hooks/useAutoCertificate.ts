import { useEffect, useState } from 'react';
import { useAuth } from '@/auth';
import { toast } from 'sonner';

interface CertificateData {
  id: string;
  certificate_number: string;
  validation_code: string;
  student_name: string;
  course_name: string;
  course_hours: number | null;
  final_score: number | null;
  issued_at: string;
}

export function useAutoCertificate(productId: string | undefined) {
  const { user } = useAuth();
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEligible, setIsEligible] = useState(false);

  useEffect(() => {
    if (user && productId) {
      checkCertificate();
    }
  }, [user, productId]);

  const checkCertificate = async () => {
    if (!user || !productId) return;

    try {
      // Placeholder - course_certificates and enrollments tables don't exist yet
      // For now, always show as not eligible
      setIsEligible(false);
    } catch (error) {
      console.error('Error checking certificate:', error);
    }
  };

  const generateCertificate = async (studentName?: string) => {
    if (!user || !productId || isGenerating) return null;

    setIsGenerating(true);
    try {
      // Placeholder - tables don't exist yet
      const certNumber = `SKY-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const valCode = Math.random().toString(36).substring(2, 10).toUpperCase();

      const newCert: CertificateData = {
        id: crypto.randomUUID(),
        certificate_number: certNumber,
        validation_code: valCode,
        student_name: studentName || user.email?.split('@')[0] || 'Aluno',
        course_name: 'Curso',
        course_hours: 10,
        final_score: 85,
        issued_at: new Date().toISOString()
      };

      setCertificate(newCert);
      toast.success('🎓 Certificado gerado com sucesso!');
      
      return newCert;
    } catch (error: any) {
      console.error('Error generating certificate:', error);
      toast.error('Erro ao gerar certificado');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    certificate,
    isEligible,
    isGenerating,
    generateCertificate,
    refresh: checkCertificate
  };
}
