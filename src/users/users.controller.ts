// Imports
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';

interface AuthenticatedUser {
  id: number;
  email: string;
  user_name?: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: { user: AuthenticatedUser }) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('userstatus/:id')
  async getUserStatus(@Param('id', ParseIntPipe) userId: number) {
    return this.usersService.getUserStatus(userId);
  }
}
