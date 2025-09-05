// Imports
import { Emi } from '../emi/emi.model';
import { Module } from '@nestjs/common';
import { Loan } from '../loan/loan.model';
import { PaymentService } from './payment.service';
import { Payment } from '../payment/payment.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { PaymentController } from '../payment/payment.controller';

@Module({
  imports: [SequelizeModule.forFeature([Payment, Emi, Loan])],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
