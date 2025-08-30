// Imports
import { Loan } from './loan.model';
import { Kyc } from '../kyc/kyc.model';
import { Emi } from '../emi/emi.model';
import { Module } from '@nestjs/common';
import { User } from '../users/users.model';
import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CryptoModule } from '../common/utils/crypto.module';

@Module({
  imports: [SequelizeModule.forFeature([Loan, User, Kyc, Emi]), CryptoModule],
  controllers: [LoanController],
  providers: [LoanService],
})
export class LoanModule {}
