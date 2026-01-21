import { toast } from 'sonner';

interface GenerateCertificateParams {
  userId: string;
  productId: string;
  studentName: string;
  courseName: string;
  courseHours?: number;
  finalScore?: number;
  sendEmail?: boolean;
  recipientEmail?: string;
}

interface CertificateResult {
  success: boolean;
  certificateId?: string;
  validationCode?: string;
  certificateNumber?: string;
  error?: string;
}

// Generate a unique 8-character validation code
function generateValidationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate certificate number in format: CERT-YYYY-XXXXX
function generateCertificateNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
  return `CERT-${year}-${random}`;
}

// Local storage key for certificates
const CERTIFICATES_KEY = 'user_certificates';

interface StoredCertificate {
  id: string;
  userId: string;
  productId: string;
  certificateNumber: string;
  validationCode: string;
  studentName: string;
  courseName: string;
  courseHours: number;
  finalScore?: number;
  issuedAt: string;
}

function getStoredCertificates(): StoredCertificate[] {
  try {
    const stored = localStorage.getItem(CERTIFICATES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCertificate(cert: StoredCertificate): void {
  const certs = getStoredCertificates();
  certs.push(cert);
  localStorage.setItem(CERTIFICATES_KEY, JSON.stringify(certs));
}

export async function checkCertificateEligibility(
  userId: string,
  productId: string
): Promise<{ eligible: boolean; reason?: string; quizScores?: number[] }> {
  try {
    // Check if certificate already exists in local storage
    const certs = getStoredCertificates();
    const existingCert = certs.find(c => c.userId === userId && c.productId === productId);

    if (existingCert) {
      return { 
        eligible: true, 
        reason: 'Certificado já emitido',
        quizScores: []
      };
    }

    // For demo purposes, always eligible if no certificate exists
    return { eligible: true, quizScores: [] };

  } catch (error) {
    console.error('Error checking certificate eligibility:', error);
    return { eligible: false, reason: 'Erro ao verificar elegibilidade' };
  }
}

export async function generateCertificate(
  params: GenerateCertificateParams
): Promise<CertificateResult> {
  const { userId, productId, studentName, courseName, courseHours = 0, finalScore } = params;

  try {
    // Check if certificate already exists
    const certs = getStoredCertificates();
    const existingCert = certs.find(c => c.userId === userId && c.productId === productId);

    if (existingCert) {
      return {
        success: true,
        certificateId: existingCert.id,
        validationCode: existingCert.validationCode,
        certificateNumber: existingCert.certificateNumber
      };
    }

    // Generate unique codes
    const validationCode = generateValidationCode();
    const certificateNumber = generateCertificateNumber();
    const id = `cert_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Create certificate in local storage
    const newCert: StoredCertificate = {
      id,
      userId,
      productId,
      certificateNumber,
      validationCode,
      studentName,
      courseName,
      courseHours,
      finalScore,
      issuedAt: new Date().toISOString()
    };

    saveCertificate(newCert);

    toast.success('Certificado gerado com sucesso!');

    return {
      success: true,
      certificateId: id,
      validationCode,
      certificateNumber
    };

  } catch (error: any) {
    console.error('Error generating certificate:', error);
    toast.error('Erro ao gerar certificado');
    return {
      success: false,
      error: error.message || 'Erro desconhecido'
    };
  }
}

export async function getCertificateByProduct(
  userId: string,
  productId: string
): Promise<StoredCertificate | null> {
  const certs = getStoredCertificates();
  return certs.find(c => c.userId === userId && c.productId === productId) || null;
}
