// Imports
import { Module } from '@nestjs/common';
import { KycModule } from '../../kyc/kyc.module';
import { OtpModule } from '../../otp/otp.module';
import { EmiModule } from '../../emi/emi.module';
import { AuthModule } from '../../auth/auth.module';
import { LoanModule } from '../../loan/loan.module';
import { UsersModule } from '../../users/users.module';
import { PaymentModule } from '../../payment/payment.module';
import { UploadsModule } from '../../uploads/uploads.module';
import { CryptoModule } from '../../common/utils/crypto.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    KycModule,
    UploadsModule,
    OtpModule,
    LoanModule,
    CryptoModule,
    EmiModule,
    PaymentModule,
  ],
})
export class ApiV1Module {}
