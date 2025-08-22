// Imports
import {
  raiseBadReq,
  raiseNotFound,
  raiseUnauthorized,
} from '../config/error.config';
import { Op } from 'sequelize';
import { relative } from 'path';
import { Upload } from './upload.model';
import { Kyc } from '..//kyc/kyc.model';
import { Injectable } from '@nestjs/common';
import { User } from '..//users/users.model';
import { InjectModel } from '@nestjs/sequelize';

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

    if (!kycId) {
      throw raiseBadReq('kycId is required');
    }

    const kyc = await this.kycModel.findByPk(kycId);
    if (!kyc) return raiseNotFound('KYC not found');

    const records = await Promise.all(
      files.map(async (file) => {
        const existing = await this.uploadModel.findOne({
          where: { kycId, tag: file.fieldname },
        });

        if (existing) {
          throw raiseBadReq(
            `File for "${file.fieldname}" already uploaded for this KYC.`,
          );
        }

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
}
