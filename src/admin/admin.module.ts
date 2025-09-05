// Imports
import { Emi } from '../emi/emi.model';
import { Module } from '@nestjs/common';
import { Loan } from '../loan/loan.model';
import { User } from '../users/users.model';
import { EmiModule } from '../emi/emi.module';
import { AuthModule } from '../auth/auth.module';
import { Payment } from '../payment/payment.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminService } from './admin/admin.service';
import { PaymentModule } from '../payment/payment.module';
import { AdminController } from './admin/admin.controller';
import { CryptoModule } from '../common/utils/crypto.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Loan, Emi, Payment]),
    AuthModule,
    CryptoModule,
    EmiModule,
    PaymentModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
