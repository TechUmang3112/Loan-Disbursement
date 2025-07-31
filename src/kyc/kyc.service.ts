// Imports
import { Kyc } from './kyc.model';
import { InjectModel } from '@nestjs/sequelize';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class KycService {
  constructor(@InjectModel(Kyc) private readonly kycModel: typeof Kyc) {}

  async createKyc(userId: number) {
    return this.kycModel.create({ userId });
  }

  async getById(kycId: number) {
    const kyc = await this.kycModel.findByPk(kycId);
    if (!kyc) throw new NotFoundException('KYC not found');
    return kyc;
  }

  async getByUserId(userId: number) {
    return this.kycModel.findAll({ where: { userId } });
  }
}
