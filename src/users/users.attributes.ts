export interface UserAttributes {
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
  pan_number: string;
}
