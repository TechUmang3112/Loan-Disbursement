// Imports
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Upload } from './upload.model';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { Kyc } from '../kyc/kyc.model';

@Module({
  imports: [SequelizeModule.forFeature([Upload, Kyc])],
  controllers: [UploadsController],
  providers: [UploadsService],
  exports: [UploadsService],
})
export class UploadsModule {}
