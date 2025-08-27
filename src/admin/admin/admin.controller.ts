// Imports
import {
  Controller,
  Patch,
  Param,
  ParseIntPipe,
  Get,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
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
}
