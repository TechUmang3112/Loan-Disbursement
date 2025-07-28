// Imports
import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpService {
  generateOtp(): string {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    return otp;
  }
  generateOtpPayload() {
    const otp = this.generateOtp();
    const otp_timer = new Date();
    otp_timer.setMinutes(otp_timer.getMinutes() + 1);
    const max_retry = 0;

    return { otp, otp_timer, max_retry };
  }
}
