// Imports
import { Module } from '@nestjs/common';
import { Loan } from '../loan/loan.model';
import { User } from '../users/users.model';
import { AuthModule } from '../auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminService } from './admin/admin.service';
import { AdminController } from './admin/admin.controller';
import { CryptoModule } from '../common/utils/crypto.module';

@Module({
  imports: [SequelizeModule.forFeature([User, Loan]), AuthModule, CryptoModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
