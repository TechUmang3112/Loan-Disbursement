// Imports
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Upload } from './upload.model';
import { Kyc } from '..//kyc/kyc.model';
import { relative, join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class UploadsService {
  constructor(
    @InjectModel(Upload) private uploadModel: typeof Upload,
    @InjectModel(Kyc) private kycModel: typeof Kyc,
  ) {}

  private getRelativePath(absPath: string) {
    return relative(process.cwd(), absPath).replace(/\\/g, '/');
  }

  async saveFiles(kycId: number, userId: number, files: Express.Multer.File[]) {
    const kyc = await this.kycModel.findByPk(kycId);
    if (!kyc) throw new NotFoundException('KYC not found');

    const records = await Promise.all(
      files.map((file) =>
        this.uploadModel.create({
          kycId,
          userId,
          tag: file.fieldname,
          originalName: file.originalname,
          path: this.getRelativePath(file.path),
          mimeType: file.mimetype,
          size: file.size,
        }),
      ),
    );

    return records;
  }

  async list(kycId: number) {
    return this.uploadModel.findAll({
      where: { kycId },
      order: [['created_at', 'DESC']],
    });
  }

  async getOne(kycId: number, uploadId: number) {
    const record = await this.uploadModel.findOne({
      where: { kycId, id: uploadId },
    });
    if (!record) throw new NotFoundException('File not found');
    return record;
  }

  async remove(kycId: number, uploadId: number) {
    const record = await this.getOne(kycId, uploadId);

    try {
      await fs.unlink(join(process.cwd(), record.path));
    } catch {}

    await record.destroy();
    return { deleted: true };
  }
}
