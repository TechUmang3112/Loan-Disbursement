export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  user_name: string;
  mobile_number: string;
  otp: string | null;
  otp_timer: Date | null;
  is_email_verified: number;
  is_mobile_verified: number;
  max_retry: number;
  address: string;
  aadhar_number: string;
  is_aadhar_verified: number;
  pan_number: string;
  is_pan_verified: number;
  full_name: string;
  salary_statement_path: string;
  salary: number;
  loan_amount: number;
  disburse_amount: number;
  company_name: string;
  dob: string | null;
  gender: string;
  kyc_status: number;
}
