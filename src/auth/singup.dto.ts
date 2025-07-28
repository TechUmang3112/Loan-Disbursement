//imports
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
  password: string;

  @IsNotEmpty()
  @Matches(/^[a-z0-9]{4,20}$/)
  user_name: string;

  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/)
  mobile_number: string;

  otp_timer: Date;
  max_retry: number;
}
