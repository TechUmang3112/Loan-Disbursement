// Imports
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';

interface AuthenticatedUser {
  id: number;
  email: string;
  user_name?: string;
}

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: { user: AuthenticatedUser }) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-status')
  async getOwnStatus(@Req() req: { user: AuthenticatedUser }) {
    const userId = req.user.id;
    return this.usersService.getUserStatus(userId);
  }
}
