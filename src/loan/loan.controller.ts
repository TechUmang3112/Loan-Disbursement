// Imports
import {
  Controller,
  Patch,
  Param,
  ParseIntPipe,
  Body,
  Post,
  Query,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LoanService } from './loan.service';
import { LoanOfferDto } from '../dto/loanOffer.dto';
import { JwtAuthGuard } from '../common/guards/auth.guard';

@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post('/admin/offerloan/:userId')
  async offerLoan(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: LoanOfferDto,
  ) {
    return this.loanService.offerLoan(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('approve/:loanId')
  async approveLoan(
    @Param('loanId', ParseIntPipe) loanId: number,
    @Req() req: any,
  ) {
    return this.loanService.respondToLoanOffer(loanId, 'approve', req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('reject/:loanId')
  async rejectLoan(
    @Param('loanId', ParseIntPipe) loanId: number,
    @Req() req: any,
  ) {
    return this.loanService.respondToLoanOffer(loanId, 'reject', req.user.id);
  }
}
