// Imports
import { LoanService } from './loan.service';
import { LoanOfferDto } from '@/dto/loanOffer.dto';
import { LoanResponseDto } from '@/dto/loanResponse.dto';
import { Controller, Patch, Param, ParseIntPipe, Body } from '@nestjs/common';

@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Patch('offer')
  async offerLoan(@Body() dto: LoanOfferDto) {
    return this.loanService.offerLoan(dto);
  }

  @Patch('respond/:loanId')
  async respondToLoanOffer(
    @Param('loanId', ParseIntPipe) loanId: number,
    @Body() dto: LoanResponseDto,
  ) {
    return this.loanService.respondToLoanOffer(
      dto.userId,
      loanId,
      dto.response,
    );
  }
}
