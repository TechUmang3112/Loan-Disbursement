// Imports
import { Kyc } from './kyc.model';
import { Module } from '@nestjs/common';
import { KycService } from './kyc.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { KycController } from '../kyc/kyc.controller';
import { KycDto } from '@/dto/kyc.dto';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [SequelizeModule.forFeature([Kyc]), UsersModule],
  controllers: [KycController],
  providers: [KycService],
  exports: [KycService],
})
export class KycModule {}
