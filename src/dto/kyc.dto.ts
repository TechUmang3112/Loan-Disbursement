import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class KycDto {
  @IsEmail()
  email: string;

  @IsString()
  address: string;

  @IsString()
  aadhar_number: string;

  @IsString()
  pan_number: string;

  @IsString()
  full_name: string;

  @IsNumber()
  loan_amount: number;

  @IsNumber()
  salary: number;

  @IsString()
  company_name: string;

  @IsDateString()
  dob: string;

  @IsString()
  gender: string;
}
