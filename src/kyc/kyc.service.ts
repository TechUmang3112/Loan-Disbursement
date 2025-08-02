// Imports
import { Kyc } from './kyc.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { raiseNotFound } from '@/config/error.config';
import { User } from '@/users/users.model';
import { KycDto } from '@/dto/kyc.dto';

@Injectable()
export class KycService {
  constructor(
    @InjectModel(Kyc) private readonly kycModel: typeof Kyc,
    @InjectModel(User) private readonly userModel: typeof User,
  ) {}

  async createKyc(body: KycDto) {
    const user = await this.userModel.findOne({ where: { email: body.email } });
    if (!user) throw raiseNotFound('User not found');

    await this.userModel.update(
      {
        address: body.address,
        aadhar_number: body.aadhar_number,
        pan_number: body.pan_number,
        full_name: body.full_name,
        loan_amount: body.loan_amount,
        salary: body.salary,
        company_name: body.company_name,
        dob: body.dob,
        gender: body.gender,
        kyc_status: 0,
      },
      { where: { id: user.id } },
    );

    const kycEntry = await this.kycModel.create({
      userId: user.id,
      status: 0,
    });

    return { message: 'KYC details submitted successfully', kyc: kycEntry };
  }

  async getById(kycId: number) {
    const kyc = await this.kycModel.findByPk(kycId);
    if (!kyc) throw new raiseNotFound('KYC not found');
    return kyc;
  }

  async getByUserId(userId: number) {
    return this.kycModel.findAll({ where: { userId } });
  }

  async verifyKyc(userId: number) {
    const user = await this.userModel.findByPk(userId);
    if (!user) throw new raiseNotFound('User not found');

    await this.userModel.update({ kyc_status: 1 }, { where: { id: userId } });

    await this.kycModel.update({ status: 1 }, { where: { userId } });

    return { message: 'KYC verified successfully' };
  }
}
