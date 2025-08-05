// Imports
import { IsIn, IsNumber } from 'class-validator';

export class LoanResponseDto {
  @IsNumber()
  userId: number;

  @IsIn(['approve', 'reject'])
  response: 'approve' | 'reject';
}
