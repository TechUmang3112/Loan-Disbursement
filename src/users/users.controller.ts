// Imports
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/auth.guard';

interface AuthenticatedUser {
  id: number;
  email: string;
  user_name?: string;
}

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: { user: AuthenticatedUser }) {
    return req.user;
  }

  @Get('status')
  async getUserStatus(@Query('userId') userId: string) {
    return this.usersService.getUserStatus(+userId);
  }
}
