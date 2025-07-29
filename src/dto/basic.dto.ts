// Imports
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  MaxLength,
  MinLength,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BasicDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  address: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(12)
  @MaxLength(12)
  aadhar_number: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  pan_number: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  full_name: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  loan_amount: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  salary: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  company_name: string;
}
