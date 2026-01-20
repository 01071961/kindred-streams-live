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

export async function checkCertificateEligibility(
  userId: string,
  productId: string
): Promise<{ eligible: boolean; reason?: string; quizScores?: number[] }> {
  // Note: This requires proper database tables to be set up
  // For now, return a placeholder response
  console.log('Checking certificate eligibility for:', userId, productId);
  
  return { 
    eligible: false, 
    reason: 'Sistema de certificados ainda não configurado. As tabelas necessárias precisam ser criadas.' 
  };
}

export async function generateCertificate(
  params: GenerateCertificateParams
): Promise<CertificateResult> {
  const { studentName, courseName } = params;

  // Note: This requires proper database tables to be set up
  // For now, generate a local certificate
  console.log('Generating certificate for:', studentName, courseName);
  
  const validationCode = generateValidationCode();
  const certificateNumber = generateCertificateNumber();
  
  toast.info('Sistema de certificados ainda não configurado completamente.');
  
  return {
    success: true,
    certificateId: crypto.randomUUID(),
    validationCode,
    certificateNumber
  };
}

export async function getCertificateByProduct(
  userId: string,
  productId: string
) {
  // Note: This requires proper database tables to be set up
  console.log('Getting certificate for:', userId, productId);
  return null;
}
