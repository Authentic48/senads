export interface IOtp {
  canGenerateOTP(email: string): Promise<boolean>;
  verifyOTP(email: string, code: number): Promise<boolean>;
  generateOTP(): number;
  deleteOTP(email: string): Promise<void>;
  saveAndSendOTP(email: string, code: number): Promise<void>;
}
