// Imports
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { EmiService } from './emi.service';

@Controller('emis')
export class EmiController {
  constructor(private readonly emiService: EmiService) {}

  @Get(':loanId')
  async getEmiSchedule(@Param('loanId', ParseIntPipe) loanId: number) {
    return this.emiService.getEmiSchedule(loanId);
  }

  @Post(':emiId/pay')
  async payEmi(@Param('emiId', ParseIntPipe) emiId: number) {
    return this.emiService.payEmi(emiId, new Date());
  }
}
