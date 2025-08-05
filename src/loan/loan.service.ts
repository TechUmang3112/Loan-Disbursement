// Imports
import { Loan } from './loan.model';
import { Injectable } from '@nestjs/common';
import { User } from '../users/users.model';
import { InjectModel } from '@nestjs/sequelize';
import { LoanOfferDto } from '@/dto/loanOffer.dto';
import { LoanStatus } from '../common/enums/loanStatus.enum';
import { raiseBadReq, raiseNotFound } from '@/config/error.config';

@Injectable()
export class LoanService {
  constructor(
    @InjectModel(Loan) private loanModel: typeof Loan,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  async offerLoan(dto: LoanOfferDto) {
    const user = await this.userModel.findByPk(dto.user_id);
    if (!user) throw raiseNotFound('User not found');

    if (user.kyc_status !== 1) {
      throw raiseBadReq('User KYC is not verified');
    }

    const maxEligibleAmount = user.salary * 0.25;
    if (dto.amount > maxEligibleAmount) {
      throw raiseBadReq(
        `Loan amount exceeds 25% of salary. Max allowed: ₹${maxEligibleAmount}`,
      );
    }

    const rate = 3;
    const interest = (dto.amount * rate * dto.tenure_months) / 100;
    const totalPayable = dto.amount + interest;
    const emi = totalPayable / dto.tenure_months;

    const loan = await this.loanModel.create({
      user_id: dto.user_id,
      amount: dto.amount,
      tenure_months: dto.tenure_months,
      interest_rate: rate,
      monthly_emi: parseFloat(emi.toFixed(2)),
      status: 0,
    });

    return {
      message: 'Loan offered successfully',
      loan_offer: loan,
    };
  }

  async respondToLoanOffer(
    userId: number,
    loanId: number,
    response: 'approve' | 'reject',
  ) {
    const loan = await this.loanModel.findByPk(loanId);

    if (!loan) {
      throw raiseNotFound('Loan not found');
    }

    if (loan.user_id !== userId) {
      throw raiseBadReq('You are not authorized to respond to this loan');
    }

    if (loan.status !== LoanStatus.OFFERED) {
      throw raiseBadReq('Loan has already been processed');
    }

    if (response === 'approve') {
      loan.status = LoanStatus.APPROVED;
      loan.disbursed_on = new Date();
    } else if (response === 'reject') {
      loan.status = LoanStatus.REJECTED;
    } else {
      throw raiseBadReq('Invalid response. Use "approve" or "reject".');
    }

    await loan.save();

    return {
      message: `Loan ${response}d successfully`,
      updatedLoan: loan,
    };
  }
}
