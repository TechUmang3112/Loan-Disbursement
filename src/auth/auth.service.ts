// Imports
import {
  raiseBadReq,
  raiseNotFound,
  sendOk,
  raiseTooManyReq,
  raiseUnauthorized,
} from '../config/error.config';
import * as bcrypt from 'bcrypt';
import { OtpDto } from '../otp/otp.dto';
import { JwtService } from '@nestjs/jwt';
import { BasicDto } from '../dto/basic.dto';
import { LoginDto } from '../dto/login.dto';
import { SignUpDto } from '../dto/auth.dto';
import { OtpService } from '../otp/otp.service';
import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { getISTDate } from '../common/utils/time.util';
import { crypt } from '../common/utils/crypto.service';
import { UserStatus } from '../common/enums/userStatus.enum';

const OTP_EXPIRY_MINUTES = 5;
const OTP_RESEND_COOLDOWN_SECONDS = 60;
const OTP_MAX_RETRY = 3;

@Injectable()
export default class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private otpService: OtpService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, user_name, password, mobile_number } = signUpDto;

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

    return sendOk('OTP sent successfully to your email');
  }

  async verifyOtp(otpDto: OtpDto) {
    const { email, otp } = otpDto;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw raiseNotFound('User not found');
    }

    const otpIssuedAt = user?.otp_timer ? new Date(user.otp_timer) : null;
    if (!otpIssuedAt || isNaN(otpIssuedAt.getTime())) {
      throw raiseBadReq('OTP generation time is missing or invalid.');
    }
    const expiresAt = new Date(
      otpIssuedAt.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000,
    );

    if (Date.now() >= expiresAt.getTime()) {
      throw raiseBadReq('OTP has expired. Please request a new one.');
    }

    if (user.max_retry >= OTP_MAX_RETRY) {
      throw raiseTooManyReq(
        'Maximum retry limit reached. Please request OTP again after 5 minutes.',
      );
    }

    if (user.otp?.toString() !== otp.toString()) {
      await this.usersService.updateUser(email, {
        max_retry: user.max_retry + 1,
      });

      throw raiseUnauthorized('Invalid OTP. Please try again.');
    }

    let updateFields: any = {
      otp: null,
      otp_timer: null,
      max_retry: 0,
    };

    if (user.is_email_verified === 0) {
      updateFields.is_email_verified = 1;
      updateFields.user_status = UserStatus.BASIC_DETAILS;

      await this.usersService.updateUser(email, updateFields);
      return sendOk('Email verified successfully');
    }

    if (user.is_email_verified === 1 && user.is_mobile_verified === 0) {
      updateFields.is_mobile_verified = 1;
      await this.usersService.updateUser(email, updateFields);
      return sendOk('Mobile verified successfully');
    }

    return sendOk(
      'Now you can enter your basic details then you can proceed to complete your KYC',
    );
  }

  async resendOtp(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw raiseNotFound('User not found');
    }
    if (user.otp_timer) {
      const nowIST = getISTDate(new Date());
      const lastOtpIST = getISTDate(new Date(user.otp_timer));

      const diffInSeconds = Math.floor(
        (nowIST.getTime() - lastOtpIST.getTime()) / 1000,
      );

      if (diffInSeconds < OTP_RESEND_COOLDOWN_SECONDS) {
        const secondsLeft = OTP_RESEND_COOLDOWN_SECONDS - diffInSeconds;
        return {
          message: 'Please wait before requesting a new OTP.',
          time_left: `${secondsLeft} seconds`,
          is_valid_user: true,
        };
      }
    }

    const newOtp = this.otpService.generateOtp();

    await this.usersService.updateUser(email, {
      otp: newOtp,
      otp_timer: new Date(),
      max_retry: 0,
    });

    return sendOk('OTP resent successfully');
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    if (!email || !password) {
      throw raiseBadReq('Email and password are required.');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw raiseNotFound('User not found. Please sign up first.');
    }

    if (!password) {
      throw raiseUnauthorized('Password is required.');
    }

    if (!user?.password) {
      throw raiseUnauthorized('Invalid email or password.');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw raiseUnauthorized('Invalid email or password.');
    }

    if (user.is_email_verified == 0) {
      throw raiseUnauthorized('Please verify your email to log in.');
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'Login successful',
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        user_name: user.user_name,
        role: user.role,
      },
    };
  }

  async basicDetails(body: BasicDto, email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw raiseNotFound('User not found');
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

    return sendOk('Basic details updated successfully');
  }
}
