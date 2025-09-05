// Imports
import {
  Controller,
  Patch,
  Param,
  ParseIntPipe,
  Get,
  UseGuards,
  Query,
  Post,
  Body,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { GetEmisDto } from '../../dto/getEmi.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Patch('verifySalary/:userId')
  @Roles('admin')
  async verifySalary(@Param('userId', ParseIntPipe) userId: number) {
    return this.adminService.verifySalary(userId);
  }

  @Get('/list')
  @Roles('admin')
  async listLoansByStatus(@Query('status') status: string) {
    return this.adminService.listLoansByStatus(status);
  }

  @Get('status')
  @Roles('admin')
  async getUserStatus(@Query('userId') userId: string) {
    return this.adminService.getUserStatus(+userId);
  }

  @Get('status/step')
  @Roles('admin')
  async getUsersByStatus(@Query('status') status: string) {
    return this.adminService.getUsersByStatus(+status);
  }

  @Get('status/summary')
  @Roles('admin')
  async getStatusSummary() {
    return this.adminService.getStatusSummary();
  }

  @Get('emis')
  @Roles('admin')
  async getAllEmis(@Query() query: GetEmisDto) {
    return this.adminService.getAllEmis(query);
  }

  @Get('emi')
  @Roles('admin')
  async getEmiDetails(@Query('emiId', ParseIntPipe) emiId: number) {
    return this.adminService.getEmiDetails(emiId);
  }

  @Get('emis/:userId')
  @Roles('admin')
  async getUserEmis(@Param('userId', ParseIntPipe) userId: number) {
    return this.adminService.getUserEmis(userId);
  }

  @Get('payments')
  @Roles('admin')
  async getAllPayments(
    @Query('status') status?: string,
    @Query('loanId') loanId?: number,
    @Query('userId') userId?: number,
  ) {
    return this.adminService.getAllPayments(status, loanId, userId);
  }

  @Get('payments/user')
  @Roles('admin')
  async getPaymentsForUser(@Query('userId') userId: number) {
    return this.adminService.getPaymentsForUser(userId);
  }

  @Patch('payments/update')
  @Roles('admin')
  async updatePaymentStatus(
    @Body()
    body: {
      payment_id: number;
      status: 'PAID' | 'FAILED' | 'PENDING';
      remarks?: string;
    },
  ) {
    return this.adminService.updatePaymentStatus(body);
  }
}
