// Imports
import {
  Controller,
  Get,
  Req,
  UseGuards,
  Param,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { raiseNotFound } from '@/config/error.config';
import { JwtAuthGuard } from '../middleware/jwt/auth.guard';
import { UserStatus } from '@/common/enums/userStatus.enum';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-status')
  async getOwnStatus(@Req() req) {
    const userId = req.user.id;
    const user = await this.usersService.getUserStatus(userId);
    if (!user) throw raiseNotFound('User not found');
    return user;
  }
}

@Controller('admin')
export class AdminController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('verify-salary/:userId')
  async verifySalary(@Param('userId') userId: number) {
    return this.usersService.updateUserStatus(userId, UserStatus.LOAN_APPROVED);
  }

  @Get('user-status/:userId')
  async getUserStatus(@Param('userId', ParseIntPipe) userId: number) {
    const user = await this.usersService.getUserStatus(userId);
    if (!user) {
      throw raiseNotFound('User not found');
    }
    return user;
  }
}
