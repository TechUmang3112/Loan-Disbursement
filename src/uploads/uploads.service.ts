// Imports
import { Op } from 'sequelize';
import { promises as fs } from 'fs';
import { Upload } from './upload.model';
import { Kyc } from '..//kyc/kyc.model';
import { Injectable } from '@nestjs/common';
import { User } from '..//users/users.model';
import { relative, join } from 'path';
import { InjectModel } from '@nestjs/sequelize';
import { raiseNotFound, raiseUnauthorized } from '../config/error.config';

@Injectable()
export class UploadsService {
  constructor(
    @InjectModel(Upload) private uploadModel: typeof Upload,
    @InjectModel(Kyc) private kycModel: typeof Kyc,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  private getRelativePath(absPath: string) {
    return relative(process.cwd(), absPath).replace(/\\/g, '/');
  }

  async saveFiles(kycId: number, userId: number, files: Express.Multer.File[]) {
    if (!userId) {
      throw raiseUnauthorized(
        'User ID not found in token. Make sure JWT is passed.',
      );
    }

    const kyc = await this.kycModel.findByPk(kycId);
    if (!kyc) return raiseNotFound('KYC not found');

    const records = await Promise.all(
      files.map(async (file) => {
        const saved = await this.uploadModel.create({
          kycId,
          userId,
          tag: file.fieldname,
          originalName: file.originalname,
          path: this.getRelativePath(file.path),
          mimeType: file.mimetype,
          size: file.size,
        });

        const tagToColumnMap = {
          aadhar_card: 'aadhar_card_path',
          pan_card: 'pan_card_path',
          salary_statement: 'salary_statement_path',
        };

        const columnName = tagToColumnMap[file.fieldname];
        if (columnName) {
          const relativePath = this.getRelativePath(file.path);

          await this.userModel.update(
            { [columnName]: relativePath },
            { where: { id: userId } },
          );
        }

        return saved;
      }),
    );

    return records;
  }

  async list(kycId: number) {
    return this.uploadModel.findAll({
      where: { kycId },
      order: [['created_at', 'DESC']],
    });
  }

  // async getOne(kycId: number, uploadId: number) {
  //   const record = await this.uploadModel.findOne({
  //     where: { kycId, id: uploadId },
  //   });
  //   if (!record) throw new raiseNotFound('File not found');
  //   return record;
  // }

  // async remove(kycId: number, uploadId: number) {
  //   const record = await this.getOne(kycId, uploadId);

  //   try {
  //     await fs.unlink(join(process.cwd(), record.path));
  //   } catch {}

  //   await record.destroy();
  //   return { deleted: true };
  // }
}
