// Imports
import { OtpDto } from '../otp/otp.dto';
import AuthService from './auth.service';
import { LoginDto } from '../dto/login.dto';
import { SignUpDto } from '../dto/auth.dto';
import { BasicDto } from '../dto/basic.dto';
import { Controller, Post, Body } from '@nestjs/common';
import { Public } from '@/middleware/jwt/public.decorator';

@Controller('auth')
export default class AuthController {
  constructor(private readonly service: AuthService) {}

  @Public()
  @Post('signup')
  // change signUpDto to body
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.service.signUp(signUpDto);
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.service.login(loginDto);
  }

  @Public()
  @Post('verifyotp')
  async verifyOtp(@Body() otpDto: OtpDto) {
    return await this.service.verifyOtp(otpDto);
  }

  @Public()
  @Post('resendOtp')
  async resendOtp(@Body('email') email: string) {
    return await this.service.resendOtp(email);
  }

  @Post('basicdetails')
  async basicDetails(@Body() body: BasicDto) {
    return await this.service.basicDetails(body, body.email);
  }
}
