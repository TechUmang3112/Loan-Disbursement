// Imports
import { Loan } from './loan.model';
import { Module } from '@nestjs/common';
import { User } from '../users/users.model';
import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([Loan, User])],
  controllers: [LoanController],
  providers: [LoanService],
})
export class LoanModule {}
