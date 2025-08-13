// Imports
import { Kyc } from './kyc.model';
import { KycDto } from '../dto/kyc.dto';
import { User } from '../users/users.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { KycStatus } from '../common/enums/kycStatus.enum';
import { UserStatus } from '../common/enums/userStatus.enum';
import { raiseBadReq, raiseNotFound, sendOk } from '../config/error.config';
import { VerificationStatus } from '../common/enums/verificationsStatus.enum';

@Injectable()
export class KycService {
  constructor(
    @InjectModel(Kyc) private readonly kycModel: typeof Kyc,
    @InjectModel(User) private readonly userModel: typeof User,
  ) {}

  async createKyc(body: KycDto) {
    const user = await this.userModel.findOne({ where: { email: body.email } });
    if (!user) throw raiseNotFound('User not found');

    const salaryCreditDay = body.salary_credit_day;
    let emiDueDay = salaryCreditDay + 1;
    if (emiDueDay > 31) {
      emiDueDay = 1;
    }

    if (emiDueDay < 1 || emiDueDay > 31) {
      throw raiseBadReq('Invalid EMI due day. It must be between 1 and 28.');
    }

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
        tenure_months: body.tenure_months,
        user_status: UserStatus.KYC,
        salary_credit_day: salaryCreditDay,
        emi_due_day: emiDueDay,
      },
      { where: { id: user.id } },
    );

    const kycEntry = await this.kycModel.create({
      userId: user.id,
      status: 0,
    });

    return {
      success: true,
      message: 'KYC details submitted successfully',
      kyc: kycEntry,
    };
  }

  async getById(kycId: number) {
    const kyc = await this.kycModel.findByPk(kycId);
    if (!kyc) throw raiseNotFound('KYC not found');
    return kyc;
  }

  async getByUserId(userId: number) {
    return this.kycModel.findAll({ where: { userId } });
  }

  async verifyKyc(userId: number) {
    const user = await this.userModel.findByPk(userId);
    if (!user) throw raiseNotFound('User not found');

    await this.userModel.update(
      {
        kyc_status: KycStatus.Verified,
        is_aadhar_verified: VerificationStatus.VERIFIED,
        is_pan_verified: VerificationStatus.VERIFIED,
        user_status: UserStatus.SALARY_VERIFICATION,
      },
      { where: { id: userId } },
    );

    await this.kycModel.update({ status: 1 }, { where: { userId } });

    return sendOk('KYC verified successfully');
  }

  async rejectKyc(userId: number) {
    const user = await this.userModel.findByPk(userId);
    if (!user) throw raiseNotFound('User not found');

    await this.userModel.update(
      { kyc_status: KycStatus.Rejected },
      { where: { id: userId } },
    );

    return sendOk('KYC status updated to rejected');
  }
}
