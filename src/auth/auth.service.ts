// Imports
import {
  raiseBadReq,
  raiseNotFound,
  raiseTooManyReq,
  raiseUnauthorized,
} from '@/config/error.config';
import * as bcrypt from 'bcrypt';
import { OtpDto } from '../otp/otp.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '@/auth/login.dto';
import { SignUpDto } from '@/auth/auth.dto';
import { Injectable } from '@nestjs/common';
import { OtpService } from '../otp/otp.service';
import { crypt } from '@/common/utils/cryptService';
import { UsersService } from '../users/users.service';
import { getISTDate } from '../common/utils/time.util';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private otpService: OtpService,
    private jwtService: JwtService,
  ) {}

  async signUp(SignUpDto: SignUpDto) {
    const { email, user_name, password, mobile_number } = SignUpDto;

    const is_exist = await this.usersService.isExist(
      email,
      mobile_number,
      user_name,
    );

    if (email === is_exist?.email) {
      raiseBadReq('Email already exists');
    } else if (mobile_number === is_exist?.mobile_number) {
      raiseBadReq('Mobile number already exists');
    } else if (user_name === is_exist?.user_name) {
      raiseBadReq('Username already exists');
    }

    const hashedPassword = await crypt(password);

    const { otp, otp_timer, max_retry } = this.otpService.generateOtpPayload();
    const address = '';
    const aadhar_number = '';
    const pan_number = '';
    await this.usersService.createUser({
      email,
      user_name,
      password: hashedPassword,
      mobile_number,
      otp,
      otp_timer,
      max_retry,
      address,
      aadhar_number,
      pan_number,
    });

    return {
      success: true,
      message: 'OTP sent successfully to your email',
    };
  }

  async verifyOtp(body: OtpDto) {
    const { email, otp } = body;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return raiseNotFound('User not found');
    }

    if (user.is_email_verified == 1 && user.is_mobile_verified == 1) {
      raiseBadReq('Email and Mobile are already verified');
    }

    if (!user.otp_timer || isNaN(new Date(user.otp_timer).getTime())) {
      return raiseBadReq('OTP generation time is missing or invalid.');
    }

    const lastOtpTime = user.otp_timer ? new Date(user.otp_timer) : null;

    if (lastOtpTime) {
      const current_time = new Date();
      const otp_expire_time = new Date(user?.otp_timer);

      if (otp_expire_time > current_time) {
        return raiseBadReq('OTP has expired. Please request a new one.');
      }
    }
    if (user.max_retry >= 3) {
      return raiseTooManyReq(
        'Maximum retry limit reached. Please request OTP again after 5 minutes.',
      );
    }

    if (user.otp?.toString() !== otp.toString()) {
      await this.usersService.updateUser(email, {
        max_retry: user.max_retry + 1,
      });

      return raiseBadReq('Invalid OTP. Please try again.');
    }

    await this.usersService.updateUser(email, {
      is_email_verified:
        user.is_email_verified === 0 ? 1 : user.is_email_verified,
      is_mobile_verified:
        user.is_mobile_verified === 0 ? 1 : user.is_mobile_verified,
      otp: null,
      otp_timer: null,
      max_retry: 0,
    });

    return { message: 'OTP verified successfully. Email is now verified.' };
  }

  async resendOtp(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return raiseNotFound('User not found');
    }

    if (user.is_email_verified == 1 && user.is_mobile_verified == 1) {
      raiseBadReq('Email and Mobile are already verified');
    }

    const lastOtpTime = user.otp_timer ? new Date(user.otp_timer) : null;

    if (lastOtpTime) {
      if (!user.otp_timer) {
        return raiseNotFound('OTP timer not found. Please request a new OTP.');
      }

      const nowIST = getISTDate(new Date());
      const lastOtpIST = getISTDate(new Date(user.otp_timer));

      const diffInSeconds = Math.floor(
        (nowIST.getTime() - lastOtpIST.getTime()) / 1000,
      );

      if (diffInSeconds < 60) {
        const secondsLeft = 60 - diffInSeconds;
        return {
          message: 'Please wait before requesting a new OTP.',
          time_left: `${secondsLeft} seconds`,
        };
      }
    }
    const newOtp = this.otpService.generateOtp();

    await this.usersService.updateUser(email, {
      otp: newOtp,
      otp_timer: new Date(),
      max_retry: 0,
    });

    return { message: 'OTP resent successfully' };
  }

  // get required column only
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    if (!email || !password) {
      raiseBadReq('Email and password are required.');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return raiseNotFound('User not found. Please sign up first.');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return raiseUnauthorized('Invalid email or password.');
    }

    console.log({ user });
    // Check default value alter
    if (user.is_email_verified == 0) {
      return raiseUnauthorized('Please verify your email to log in.');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'Login successful',
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        user_name: user.user_name,
      },
    };
  }
}
