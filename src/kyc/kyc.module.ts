// Imports
import { Kyc } from './kyc.model';
import { Module } from '@nestjs/common';
import { KycService } from './kyc.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { KycController } from '../kyc/kyc.controller';

@Module({
  imports: [SequelizeModule.forFeature([Kyc])],
  controllers: [KycController],
  providers: [KycService],
  exports: [KycService],
})
export class KycModule {}
