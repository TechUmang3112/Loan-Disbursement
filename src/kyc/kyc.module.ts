// Imports
import { Kyc } from './kyc.model';
import { Module } from '@nestjs/common';
import { KycService } from './kyc.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from '../users/users.module';
import { KycController } from '../kyc/kyc.controller';
import { CryptoModule } from '../common/utils/crypto.module';

@Module({
  imports: [SequelizeModule.forFeature([Kyc]), UsersModule, CryptoModule],
  controllers: [KycController],
  providers: [KycService],
  exports: [KycService],
})
export class KycModule {}
