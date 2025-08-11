// Imports
import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UploadedFiles,
  UseInterceptors,
  Res,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { join } from 'path';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { UploadsService } from './uploads.service';
import { makeMulterOptions } from './multer.config';
import { raiseUnauthorized } from '../config/error.config';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('kyc/:kycId/uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor(makeMulterOptions()))
  async upload(
    @Param('kycId', ParseIntPipe) kycId: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
  ) {
    const userId = req.user?.id;

    if (!userId) {
      throw raiseUnauthorized(
        'User ID not found in token. Make sure JWT is passed.',
      );
    }

    return this.uploadsService.saveFiles(kycId, userId, files);
  }

  @Get()
  async list(@Param('kycId', ParseIntPipe) kycId: number) {
    return this.uploadsService.list(kycId);
  }

  @Get(':uploadId')
  async download(
    @Param('kycId', ParseIntPipe) kycId: number,
    @Param('uploadId', ParseIntPipe) uploadId: number,
    @Res() res: Response,
  ) {
    const file = await this.uploadsService.getOne(kycId, uploadId);
    const absPath = join(process.cwd(), file.path);

    res.setHeader('Content-Type', file.mimeType);
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${file.originalName}"`,
    );
    createReadStream(absPath).pipe(res);
  }

  // @Delete(':uploadId')
  // async delete(
  //   @Param('kycId', ParseIntPipe) kycId: number,
  //   @Param('uploadId', ParseIntPipe) uploadId: number,
  // ) {
  //   return this.uploadsService.remove(kycId, uploadId);
  // }
}
