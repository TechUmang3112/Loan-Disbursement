// Imports
import { IsNumber, Min } from 'class-validator';

export class LoanOfferDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsNumber()
  @Min(1)
  tenure_months: number;
}
