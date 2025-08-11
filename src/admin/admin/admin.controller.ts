// Imports
import {
  Controller,
  Patch,
  Param,
  ParseIntPipe,
  Get,
  UseGuards,
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

  @Get('userStatus/:userId')
  @Roles('admin')
  async getUserStatus(@Param('userId', ParseIntPipe) userId: number) {
    return this.adminService.getUserStatus(userId);
  }
}
