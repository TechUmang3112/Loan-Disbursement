// Imports
import { User } from 'users/users.model';
import { Injectable } from '@nestjs/common';
import { Loan } from '../../loan/loan.model';
import { InjectModel } from '@nestjs/sequelize';
import { UserStatus } from 'common/enums/userStatus.enum';
import { CryptoService } from '@/common/utils/crypto.service';
import { LoanStatus } from '../../common/enums/loanStatus.enum';
import { raiseBadReq, raiseNotFound } from 'config/error.config';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,

    @InjectModel(Loan)
    private readonly loanModel: typeof Loan,

    private readonly cryptoService: CryptoService,
  ) {}

  async verifySalary(userId: number) {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw raiseNotFound('User not found');
    }

    await this.userModel.update(
      {
        user_status: UserStatus.LOAN_APPROVED,
        salary_verified: 1,
      },
      { where: { id: userId } },
    );

    return 'User salary verification status updated successfully';
  }

  async getUserStatus(userId: number) {
    const user = await this.userModel.findByPk(userId, {
      attributes: ['id', 'user_name', 'email_encrypted', 'user_status'],
    });

    if (!user) {
      throw raiseNotFound('User not found');
    }

    const plainEmail = user.email_encrypted
      ? this.cryptoService.decryptField(user.email_encrypted)
      : null;

    return {
      id: user.id,
      name: user.user_name,
      email: plainEmail,
      status_code: user.user_status,
      status_label: UserStatus[user.user_status],
    };
  }

  async listLoansByStatus(status: string) {
    const statusMap = {
      offered: LoanStatus.OFFERED,
      approved: LoanStatus.APPROVED,
      rejected: LoanStatus.REJECTED,
    };

    const normalizedStatus = status?.toLowerCase();

    if (!statusMap.hasOwnProperty(normalizedStatus)) {
      throw raiseBadReq(
        'Invalid status. Valid values are: offered, approved, rejected.',
      );
    }

    const loans = await this.loanModel.findAll({
      where: { status: statusMap[normalizedStatus] },
    });

    return {
      count: loans.length,
      status: normalizedStatus,
      loans,
    };
  }
}
