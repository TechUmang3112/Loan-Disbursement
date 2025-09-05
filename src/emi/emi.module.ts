// Imports
import { Emi } from './emi.model';
import { Module } from '@nestjs/common';
import { EmiService } from './emi.service';
import { EmiController } from './emi.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Payment } from '../payment/payment.model';

@Module({
  imports: [SequelizeModule.forFeature([Emi, Payment])],
  providers: [EmiService],
  controllers: [EmiController],
  exports: [EmiService],
})
export class EmiModule {}
