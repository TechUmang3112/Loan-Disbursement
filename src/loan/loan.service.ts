// Imports
import { Loan } from './loan.model';
import { Injectable } from '@nestjs/common';
import { User } from '../users/users.model';
import { InjectModel } from '@nestjs/sequelize';
import { LoanStatus } from '../common/enums/loanStatus.enum';
import { raiseBadReq, raiseNotFound } from '@/config/error.config';

@Injectable()
export class LoanService {
  constructor(
    @InjectModel(Loan) private loanModel: typeof Loan,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  async offerLoan(userId: number, amount: number) {
    const user = await this.userModel.findByPk(userId);
    if (!user) throw raiseNotFound('User not found');

    const maxEligible = user.salary * 0.25;
    if (amount > maxEligible) {
      throw raiseBadReq(
        `Loan amount exceeds 25% of salary. Max allowed: ₹${maxEligible}`,
      );
    }

    const interestRate = 3;
    const tenureMonths = user.tenure_months;
    const simpleInterest = (amount * interestRate * tenureMonths) / 100;
    const totalPayable = amount + simpleInterest;
    const monthlyEmi = parseFloat((totalPayable / tenureMonths).toFixed(2));

    const loan = await this.loanModel.create({
      user_id: userId,
      amount,
      interest_rate: interestRate,
      tenure_months: tenureMonths,
      monthly_emi: monthlyEmi,
      status: LoanStatus.OFFERED,
      disbursed_on: null,
    });

    return {
      message: 'Loan offer created successfully',
      loanDetails: loan,
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
