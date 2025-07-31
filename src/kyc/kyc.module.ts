// Imports
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Kyc } from './kyc.model';
import { KycService } from './kyc.service';
import { KycController } from '../kyc/kyc.controller';

@Module({
  imports: [SequelizeModule.forFeature([Kyc])],
  controllers: [KycController],
  providers: [KycService],
  exports: [KycService],
})
export class KycModule {}
