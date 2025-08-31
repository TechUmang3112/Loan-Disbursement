// Imports
import { Emi } from '../emi/emi.model';
import { Module } from '@nestjs/common';
import { Loan } from '../loan/loan.model';
import { User } from '../users/users.model';
import { EmiModule } from '../emi/emi.module';
import { AuthModule } from '../auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminService } from './admin/admin.service';
import { AdminController } from './admin/admin.controller';
import { CryptoModule } from '../common/utils/crypto.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Loan, Emi]),
    AuthModule,
    CryptoModule,
    EmiModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
