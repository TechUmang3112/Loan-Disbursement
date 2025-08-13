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
import { KycDto } from '../dto/kyc.dto';
import { KycService } from './kyc.service';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post('create')
  async create(@Body() body: KycDto) {
    return this.kycService.createKyc(body);
  }

  @Patch('verify/:userId')
  @Roles('admin')
  async verifyKyc(@Param('userId', ParseIntPipe) userId: number) {
    return this.kycService.verifyKyc(userId);
  }

  @Patch('reject/:userId')
  @Roles('admin')
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
