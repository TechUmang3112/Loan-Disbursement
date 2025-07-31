// Imports
import { Controller, Post, Param, Get, ParseIntPipe } from '@nestjs/common';
import { KycService } from './kyc.service';

@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post(':userId')
  async create(@Param('userId', ParseIntPipe) userId: number) {
    return this.kycService.createKyc(userId);
  }

  @Get('user/:userId')
  async listByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.kycService.getByUserId(userId);
  }
}
