// Imports
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../middleware/jwt/auth.guard';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
