// Imports
import { IsNumber, IsPositive, IsEnum, IsNotEmpty } from 'class-validator';

export enum PaymentStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  FAILED = 'Failed',
}

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  emi_id: number;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsEnum(PaymentStatus)
  status: PaymentStatus;
}
