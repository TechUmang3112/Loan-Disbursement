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
} from '@nestjs/common';
import { LoanService } from './loan.service';
import { LoanOfferDto } from '@/dto/loanOffer.dto';
import { LoanResponseDto } from '@/dto/loanResponse.dto';

@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post('/admin/offerloan/:userId')
  async offerLoan(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() LoanOfferDto: LoanOfferDto,
  ) {
    return this.loanService.offerLoan(userId, LoanOfferDto);
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

  @Get('/list')
  async listLoansByStatus(@Query('status') status: string) {
    return this.loanService.listLoansByStatus(status);
  }
}
