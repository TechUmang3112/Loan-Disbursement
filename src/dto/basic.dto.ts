// Imports
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  MaxLength,
  MinLength,
  IsEmail,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BasicDto {
  @IsEmail()
  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address: string;

  @IsOptional()
  @IsString()
  @MinLength(12)
  @MaxLength(12)
  aadhar_number: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  pan_number: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  full_name: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  loan_amount: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  salary: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  company_name: string;

  @IsOptional()
  @IsDateString()
  dob?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  gender?: string;
}
