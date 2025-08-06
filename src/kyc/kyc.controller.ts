// Imports
import {
  Controller,
  Post,
  Param,
  Get,
  ParseIntPipe,
  Body,
  Patch,
} from '@nestjs/common';
import { KycDto } from '@/dto/kyc.dto';
import { KycService } from './kyc.service';

@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post()
  async create(@Body() body: KycDto) {
    return this.kycService.createKyc(body);
  }

  @Patch('verify/:userId')
  async verifyKyc(@Param('userId', ParseIntPipe) userId: number) {
    return this.kycService.verifyKyc(userId);
  }

  @Patch('reject/:userId')
  async rejectKyc(@Param('userId', ParseIntPipe) userId: number) {
    return this.kycService.rejectKyc(userId);
  }

  @Get(':kycId')
  async getById(@Param('kycId', ParseIntPipe) kycId: number) {
    return this.kycService.getById(kycId);
  }

  @Get('user/:userId')
  async listByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.kycService.getByUserId(userId);
  }
}
