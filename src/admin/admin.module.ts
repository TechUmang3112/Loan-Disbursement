// Imports
import { Module } from '@nestjs/common';
import { User } from '../users/users.model';
import { AuthModule } from '@/auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminService } from './admin/admin.service';
import { AdminController } from './admin/admin.controller';

@Module({
  imports: [SequelizeModule.forFeature([User]), AuthModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
