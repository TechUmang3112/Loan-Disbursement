// Imports
import { LoanService } from './loan.service';
import { Controller, Patch, Param, ParseIntPipe, Body } from '@nestjs/common';

@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Patch('offer/:userId')
  async offerLoan(
    @Param('userId', ParseIntPipe) userId: number,
    @Body('amount') amount: number,
  ) {
    return this.loanService.offerLoan(userId, amount);
  }

  @Patch('respond/:loanId')
  async respondToLoanOffer(
    @Param('loanId', ParseIntPipe) loanId: number,
    @Body('userId', ParseIntPipe) userId: number,
    @Body('response') response: 'approve' | 'reject',
  ) {
    return this.loanService.respondToLoanOffer(userId, loanId, response);
  }
}
