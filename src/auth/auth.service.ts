// Imports
import {
  raiseBadReq,
  raiseNotFound,
  raiseTooManyReq,
  raiseUnauthorized,
} from '../config/error.config';
import * as bcrypt from 'bcrypt';
import { OtpDto } from '../otp/otp.dto';
import { JwtService } from '@nestjs/jwt';
import { BasicDto } from '../dto/basic.dto';
import { LoginDto } from '../dto/login.dto';
import { SignUpDto } from '../dto/auth.dto';
import { Injectable } from '@nestjs/common';
import { OtpService } from '../otp/otp.service';
import { UsersService } from '../users/users.service';
import { getISTDate } from '../common/utils/time.util';
import { UserStatus } from '../common/enums/userStatus.enum';
import { CryptoService } from '../common/utils/crypto.service';
import { MailJetService } from '../thirdParty/mailjet/mail.jet.service';

const OTP_EXPIRY_MINUTES = 5;
const OTP_RESEND_COOLDOWN_SECONDS = 60;
const OTP_MAX_RETRY = 3;

@Injectable()
export default class AuthService {
  constructor(
    private usersService: UsersService,
    private otpService: OtpService,
    private jwtService: JwtService,
    private cryptoService: CryptoService,
    private mailService: MailJetService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, user_name, password, confirm_password, mobile_number } =
      signUpDto;

    if (password !== confirm_password) {
      raiseBadReq('Passwords do not match');
    }

    const is_exist = await this.usersService.isExist(
      this.cryptoService.hashField(email),
      this.cryptoService.hashField(mobile_number),
      user_name,
    );

    if (is_exist?.email_hash === this.cryptoService.hashField(email)) {
      raiseBadReq('Email already exists');
    } else if (
      is_exist?.mobile_hash === this.cryptoService.hashField(mobile_number)
    ) {
      raiseBadReq('Mobile number already exists');
    } else if (user_name === is_exist?.user_name) {
      raiseBadReq('Username already exists');
    }

    await this.usersService.createUser({
      email,
      email_encrypted: this.cryptoService.encryptField(email),
      email_hash: this.cryptoService.hashField(email),
      user_name,
      password,
      mobile_number,
      mobile_encrypted: this.cryptoService.encryptField(mobile_number),
      mobile_hash: this.cryptoService.hashField(mobile_number),
      max_retry: 0,
    });

    const otpResponse = await this.resendOtp(email);
    return otpResponse;
  }

  async resendOtp(email: string) {
    const user = await this.usersService.findByEmailHash(
      this.cryptoService.hashField(email),
    );
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

    await this.usersService.updateUserByHash(
      this.cryptoService.hashField(email),
      {
        otp: newOtp,
        otp_timer: new Date(),
        max_retry: 0,
      },
    );

    const decryptedEmail = this.cryptoService.decryptField(
      user.email_encrypted,
    );

    if (!decryptedEmail) {
      throw new Error('Failed to decrypt email');
    }

    await this.mailService.sendOtpMail(decryptedEmail, newOtp, user.user_name);

    return `OTP Sent Successfully To ${email}`;
  }

  async verifyOtp(otpDto: OtpDto) {
    const { email, otp } = otpDto;

    const user = await this.usersService.findByEmailHash(
      this.cryptoService.hashField(email),
    );
    if (!user) {
      throw raiseNotFound('User not found');
    }

    if (!otp) {
      throw raiseBadReq('OTP is required.');
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
      await this.usersService.updateUserByHash(
        this.cryptoService.hashField(email),
        {
          max_retry: user.max_retry + 1,
        },
      );
      throw raiseUnauthorized('Invalid OTP. Please try again.');
    }

    const updateFields: any = {
      otp: null,
      otp_timer: null,
      max_retry: 0,
    };

    if (user.is_email_verified === 0) {
      updateFields.is_email_verified = 1;
      updateFields.user_status = UserStatus.BASIC_DETAILS;

      await this.usersService.updateUserByHash(
        this.cryptoService.hashField(email),
        updateFields,
      );
      return 'Email verified successfully';
    }

    if (user.is_email_verified === 1 && user.is_mobile_verified === 0) {
      updateFields.is_mobile_verified = 1;

      await this.usersService.updateUserByHash(
        this.cryptoService.hashField(email),
        updateFields,
      );
      return 'Mobile verified successfully';
    }

    return 'Now you can enter your basic details then you can proceed to complete your KYC';
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    if (!email || !password) {
      throw raiseBadReq('Email and password are required.');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailHash = this.cryptoService.hashField(normalizedEmail);
    const user = await this.usersService.findByEmailHash(emailHash);
    if (!user) {
      throw raiseNotFound('User not found. Please sign up first.');
    }

    if (!user?.password) {
      throw raiseUnauthorized('Invalid email or password.');
    }

    const passwordmatches = await bcrypt.compare(password, user.password);
    if (!passwordmatches) {
      throw raiseUnauthorized('Invalid email or password.');
    }

    if (user.is_email_verified == 0) {
      throw raiseUnauthorized('Please verify your email to log in.');
    }

    const plainEmail = this.cryptoService.decryptField(user.email_encrypted);

    const payload = { id: user.id, email: plainEmail, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      access_token: accessToken,
      user: {
        id: user.id,
        email: plainEmail,
        user_name: user.user_name,
        role: user.role,
      },
    };
  }

  async basicDetails(body: BasicDto, email: string) {
    const user = await this.usersService.findByEmailHash(
      this.cryptoService.hashField(email),
    );
    if (!user) {
      throw raiseNotFound('User not found');
    }

    await this.usersService.updateUserByHash(
      this.cryptoService.hashField(email),
      {
        address: body.address,
        aadhar_encrypted: this.cryptoService.encryptField(body.aadhar_number),
        aadhar_hash: this.cryptoService.hashField(body.aadhar_number),
        pan_number: body.pan_number,
        full_name: body.full_name,
        loan_amount: body.loan_amount,
        salary: body.salary,
        company_name: body.company_name,
        dob: body.dob,
        gender: body.gender,
      },
    );

    return 'Basic details updated successfully';
  }

  async logout(user?: any) {
    return {
      message: 'Logged out successfully',
      user: user ? { id: user.id, email: user.email } : null,
    };
  }
}
