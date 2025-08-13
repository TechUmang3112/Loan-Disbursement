// Imports
import {
  raiseBadReq,
  raiseForbidden,
  raiseNotFound,
} from '../config/error.config';
import { Loan } from './loan.model';
import { Kyc } from '../kyc/kyc.model';
import { Injectable } from '@nestjs/common';
import { User } from '../users/users.model';
import { InjectModel } from '@nestjs/sequelize';
import { LoanOfferDto } from '../dto/loanOffer.dto';
import { UserStatus } from '../common/enums/userStatus.enum';
import { LoanStatus } from '../common/enums/loanStatus.enum';

@Injectable()
export class LoanService {
  constructor(
    @InjectModel(Loan) private loanModel: typeof Loan,
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Kyc) private kycModel: typeof Kyc,
  ) {}

  async offerLoan(userId: number, dto: LoanOfferDto) {
    const user = await this.userModel.findByPk(userId);
    if (!user) throw raiseNotFound('User not found');

    const kyc = await this.kycModel.findOne({ where: { userId } });
    if (!kyc || kyc.status !== 1) {
      throw raiseBadReq('User KYC is not verified');
    }

    const maxEligibleAmount = user.salary * 0.25;
    if (dto.amount > maxEligibleAmount) {
      throw raiseBadReq(
        `Loan amount exceeds 25% of salary. Max allowed: ₹${maxEligibleAmount}`,
      );
    }

    const interestRate = 3;
    const totalInterest = (dto.amount * interestRate * dto.tenure_months) / 100;
    const totalPayable = dto.amount + totalInterest;
    const monthlyEMI =
      Math.round((totalPayable / dto.tenure_months) * 100) / 100;

    const loan = await this.loanModel.create({
      user_id: userId,
      amount: dto.amount,
      tenure_months: dto.tenure_months,
      interest_rate: interestRate,
      monthly_emi: monthlyEMI,
      status: LoanStatus.OFFERED,
    });

    await this.userModel.update(
      { user_status: UserStatus.LOAN_APPROVED },
      { where: { id: userId } },
    );
    return {
      success: true,
      message: 'Loan offered successfully',
      loan_offer: loan,
    };
  }

  async respondToLoanOffer(
    loanId: number,
    response: 'approve' | 'reject',
    userId: number,
  ) {
    const loan = await this.loanModel.findByPk(loanId);
    if (!loan) {
      throw raiseNotFound('Loan not found');
    }
    if (loan.userId !== userId) {
      throw raiseForbidden('You are not authorized to respond to this loan');
    }

    if (loan.status === LoanStatus.APPROVED) {
      throw raiseBadReq('Loan already approved. You cannot respond again.');
    }

    if (loan.status === LoanStatus.REJECTED) {
      throw raiseBadReq('Loan already rejected. You cannot respond again.');
    }

    if (response === 'approve') {
      loan.status = LoanStatus.APPROVED;

      await this.userModel.update(
        {
          disbursed_amount: loan.amount,
          user_status: UserStatus.DISBURSEMENT,
        },
        {
          where: { id: userId },
        },
      );

      await this.loanModel.update(
        { disbursed_amount: loan.amount },
        { where: { loanId: loan.loanId } },
      );

      loan.disbursed_on = new Date();

      const user = await this.userModel.findByPk(userId);
      if (!user?.emi_due_day) {
        throw raiseBadReq('EMI due day is not set for this user');
      }

      const emiDay = user.emi_due_day;
      if (emiDay < 1 || emiDay > 28) {
        throw raiseBadReq('Invalid EMI due day. It must be between 1 and 28.');
      }

      const today = new Date();
      const nextEmiDate = new Date(today);
      nextEmiDate.setDate(emiDay);

      if (nextEmiDate <= today) {
        nextEmiDate.setMonth(nextEmiDate.getMonth() + 1);
      }

      loan.next_emi_date = nextEmiDate;
    } else if (response === 'reject') {
      loan.status = LoanStatus.REJECTED;
    } else {
      throw raiseBadReq('Invalid response. Use "approve" or "reject".');
    }

    await loan.save();

    return {
      success: true,
      message: `Loan ${response}d successfully`,
      updatedLoan: loan,
    };
  }

 
}
