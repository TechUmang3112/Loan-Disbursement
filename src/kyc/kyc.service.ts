// Imports
import { Kyc } from './kyc.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { raiseNotFound } from '@/config/error.config';

@Injectable()
export class KycService {
  constructor(@InjectModel(Kyc) private readonly kycModel: typeof Kyc) {}

  async createKyc(userId: number) {
    return this.kycModel.create({ userId });
  }

  async getById(kycId: number) {
    const kyc = await this.kycModel.findByPk(kycId);
    if (!kyc) throw new raiseNotFound('KYC not found');
    return kyc;
  }

  async getByUserId(userId: number) {
    return this.kycModel.findAll({ where: { userId } });
  }
}
