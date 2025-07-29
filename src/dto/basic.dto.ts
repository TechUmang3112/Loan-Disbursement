// Imports
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BasicDto {
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
  @IsString()
  @MaxLength(100)
  company_name: string;
}
