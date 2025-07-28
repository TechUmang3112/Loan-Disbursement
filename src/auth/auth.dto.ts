// Imports
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
  isAlphanumeric,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(256)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  mobile_number: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  @MinLength(3)
  user_name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  password: string;

  //otp_timer: Date;
  //max_retry: number;
}
