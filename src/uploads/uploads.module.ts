// Imports
import { Kyc } from '../kyc/kyc.model';
import { Module } from '@nestjs/common';
import { Upload } from './upload.model';
import { UploadsService } from './uploads.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from '../users/users.module';
import { UploadsController } from './uploads.controller';

@Module({
  imports: [SequelizeModule.forFeature([Upload, Kyc]), UsersModule],
  controllers: [UploadsController],
  providers: [UploadsService],
  exports: [UploadsService],
})
export class UploadsModule {}
