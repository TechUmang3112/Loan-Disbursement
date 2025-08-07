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
import { BasicDto } from '../dto/basic.dto';
import { LoginDto } from '../dto/login.dto';
import { SignUpDto } from '../dto/auth.dto';
import { Injectable } from '@nestjs/common';
import { OtpService } from '../otp/otp.service';
import { crypt } from '@/common/utils/crypt.service';
import { UsersService } from '../users/users.service';
import { getISTDate } from '../common/utils/time.util';

@Injectable()
export default class AuthService {
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

    await this.usersService.createUser({
      email,
      user_name,
      password: hashedPassword,
      mobile_number,
      otp,
      otp_timer,
      max_retry,
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
      throw new raiseNotFound('User not found');
    }

    const otpIssuedAt = user?.otp_timer ? new Date(user.otp_timer) : null;
    if (!otpIssuedAt || isNaN(otpIssuedAt.getTime())) {
      throw new raiseBadReq('OTP generation time is missing or invalid.');
    }

    const expiresAt = new Date(otpIssuedAt.getTime() + 5 * 60 * 1000);

    if (Date.now() >= expiresAt.getTime()) {
      throw new raiseBadReq('OTP has expired. Please request a new one.');
    }

    if (user.max_retry >= 3) {
      throw new raiseTooManyReq(
        'Maximum retry limit reached. Please request OTP again after 5 minutes.',
      );
    }

    if (user.otp?.toString() !== otp.toString()) {
      await this.usersService.updateUser(email, {
        max_retry: user.max_retry + 1,
      });

      throw new raiseUnauthorized('Invalid OTP. Please try again.');
    }

    // const isKycAvailable =
    //   user.aadhar_number && user.pan_number && user.full_name && user.salary;

    let updateFields: any = {
      otp: null,
      otp_timer: null,
      max_retry: 0,
    };

    if (user.is_email_verified === 0) {
      updateFields.is_email_verified = 1;
      updateFields.UserStatus.BASIC_DETAILS;
      await this.usersService.updateUser(email, updateFields);
      return { message: 'Email verified successfully' };
    }

    if (user.is_email_verified === 1 && user.is_mobile_verified === 0) {
      updateFields.is_mobile_verified = 1;
      await this.usersService.updateUser(email, updateFields);
      return { message: 'Mobile verified successfully' };
    }

    // if (
    //   user.is_mobile_verified === 1 &&
    //   user.is_aadhar_verified === 0 &&
    //   isKycAvailable
    // ) {
    //   updateFields.is_aadhar_verified = 1;
    //   await this.usersService.updateUser(email, updateFields);
    //   return { message: 'Aadhaar verified successfully' };
    // }

    // if (user.is_aadhar_verified === 1 && user.is_pan_verified === 0) {
    //   updateFields.is_pan_verified = 1;
    //   await this.usersService.updateUser(email, updateFields);
    //   return { message: 'PAN verified successfully' };
    // }

    return {
      message:
        'Now you can enter your basic details then you can proceed to complete your KYC',
    };
  }

  async resendOtp(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new raiseNotFound('User not found');
    }

    const isKycAvailable =
      user.aadhar_number && user.pan_number && user.full_name && user.salary;

    if (user.is_email_verified === 0) {
    } else if (user.is_mobile_verified === 0) {
    } else if (user.is_mobile_verified === 1 && user.is_aadhar_verified === 0) {
      if (!isKycAvailable) {
        throw new raiseBadReq(
          'Please provide basic KYC details before verifying Aadhaar.',
        );
      }
    } else if (user.is_aadhar_verified === 1 && user.is_pan_verified === 0) {
    } else {
      throw new raiseBadReq('All verifications are already completed.');
    }

    if (user.otp_timer) {
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
      throw new raiseBadReq('Email and password are required.');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new raiseNotFound('User not found. Please sign up first.');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new raiseUnauthorized('Invalid email or password.');
    }

    if (user.is_email_verified == 0) {
      throw new raiseUnauthorized('Please verify your email to log in.');
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

  async basicDetails(body: BasicDto, email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new raiseNotFound('User not found');
    }

    await this.usersService.updateUser(email, {
      address: body.address,
      aadhar_number: body.aadhar_number,
      pan_number: body.pan_number,
      full_name: body.full_name,
      loan_amount: body.loan_amount,
      salary: body.salary,
      company_name: body.company_name,
      dob: body.dob,
      gender: body.gender,
    });

    return { message: 'Basic details updated successfully' };
  }
}
