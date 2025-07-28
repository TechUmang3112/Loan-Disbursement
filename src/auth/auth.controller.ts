// Imports
import { LoginDto } from './login.dto';
import { SignUpDto } from './auth.dto';
import { OtpDto } from '../otp/otp.dto';
import { AuthService } from './auth.service';
import { Controller, Post, Body, Req } from '@nestjs/common'; // Remove un used

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('signup')
  // change signUpDto to body
  async signUp(@Body() signUpDto: SignUpDto, res) {
    return await this.service.signUp(signUpDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.service.login(loginDto);
  }

  @Post('verifyotp')
  async verifyOtp(@Body() otpDto: OtpDto) {
    return await this.service.verifyOtp(otpDto);
  }

  @Post('resendOtp')
  async resendOtp(@Body('email') email: string) {
    return await this.service.resendOtp(email);
  }
}
