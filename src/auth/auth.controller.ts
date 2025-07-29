// Imports
import { LoginDto } from '../dto/login.dto';
import { SignUpDto } from '../dto/auth.dto';
import { OtpDto } from '../otp/otp.dto';
import { AuthService } from './auth.service';
import { Controller, Post, Body } from '@nestjs/common';
import { BasicDto } from '../dto/basic.dto';

@Controller('auth')
export default class AuthController {
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

  @Post('basicdetails')
  async basicDetails(@Body() BasicDto: BasicDto) {
    return await this.service.basicDetails(BasicDto);
  }
}
