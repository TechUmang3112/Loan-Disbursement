// Imports
import {
  Controller,
  Post,
  Get,
  Param,
  UploadedFiles,
  UseInterceptors,
  ParseIntPipe,
  Req,
  Query,
} from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { makeMulterOptions } from './multer.config';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('kyc/uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor(makeMulterOptions()))
  async upload(
    @Query('kycId', ParseIntPipe) kycId: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
  ) {
    return this.uploadsService.saveFiles(kycId, req.user?.id, files);
  }

  @Get()
  async list(@Query('kycId', ParseIntPipe) kycId: number) {
    return this.uploadsService.list(kycId);
  }
}
