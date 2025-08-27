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

  private steps = [
    { id: 1, label: 'Registration' },
    { id: 2, label: 'Basic Details' },
    { id: 3, label: 'KYC' },
    { id: 4, label: 'Salary Verification' },
    { id: 5, label: 'Loan Approved' },
    { id: 6, label: 'Disbursement' },
  ];

  async getUserStatus(userId: number) {
    const user = await this.userModel.findByPk(userId);
    if (!user) return raiseNotFound('User not found');

    const currentStatus = user.user_status;

    const statusLabel =
      this.steps.find((s) => s.id === currentStatus)?.label ?? 'Unknown';

    const plainEmail = user.email_encrypted
      ? this.cryptoService.decryptField(user.email_encrypted)
      : null;

    return {
      userId,
      currentStatus,
      statusLabel,
      email: plainEmail,
      name: user.user_name,
    };
  }

  async getUsersByStatus(status: number) {
    const users = await this.userModel.findAll({
      where: { user_status: status },
      attributes: ['id', 'email', 'user_name', 'user_status'],
    });

    return {
      status,
      statusLabel: this.steps.find((s) => s.id === status)?.label ?? 'Unknown',
      users,
    };
  }

  async getStatusSummary() {
    const summary: { id: number; label: string; count: number }[] = [];

    for (const step of this.steps) {
      const count = await this.userModel.count({
        where: { user_status: step.id },
      });
      summary.push({ id: step.id, label: step.label, count });
    }

    return {
      Summary: summary,
    };
  }
}
