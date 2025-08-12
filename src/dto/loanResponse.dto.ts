// Imports
import { IsIn, IsNumber } from 'class-validator';

export class LoanResponseDto {
  @IsIn(['approve', 'reject'])
  response: 'approve' | 'reject';
}
