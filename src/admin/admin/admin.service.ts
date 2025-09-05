// Imports
import { Op } from 'sequelize';
import { User } from 'users/users.model';
import { Emi } from '../../emi/emi.model';
import { Injectable } from '@nestjs/common';
import { Loan } from '../../loan/loan.model';
import { InjectModel } from '@nestjs/sequelize';
import { GetEmisDto } from '../../dto/getEmi.dto';
import { UserStatus } from 'common/enums/userStatus.enum';
import { LoanStatus } from '../../common/enums/loanStatus.enum';
import { raiseBadReq, raiseNotFound } from 'config/error.config';
import { CryptoService } from '../../common/utils/crypto.service';
import { Payment, PaymentStatusType } from '../../payment/payment.model';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,

    @InjectModel(Loan)
    private readonly loanModel: typeof Loan,

    @InjectModel(Emi)
    private emiModel: typeof Emi,

    @InjectModel(Payment)
    private paymentModel: typeof Payment,

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

  async getAllEmis(filters: GetEmisDto) {
    const { loanId, status, page, limit, dueDateFrom, dueDateTo } = filters;

    const offset = (page - 1) * limit;

    const where: any = {};

    if (loanId) where.loan_id = loanId;

    if (status) where.status = status;

    if (dueDateFrom && dueDateTo) {
      where.due_date = {
        [Op.between]: [new Date(dueDateFrom), new Date(dueDateTo)],
      };
    } else if (dueDateFrom) {
      where.due_date = { [Op.gte]: new Date(dueDateFrom) };
    } else if (dueDateTo) {
      where.due_date = { [Op.lte]: new Date(dueDateTo) };
    }

    const { rows, count } = await this.emiModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['due_date', 'ASC']],
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async getEmiDetails(emiId: number) {
    const emi = await this.emiModel.findByPk(emiId);

    if (!emi) {
      return raiseNotFound(`EMI with id ${emiId} not found`);
    }

    return emi;
  }

  async getUserEmis(userId: number) {
    const emis = await this.emiModel.findAll({
      include: [
        {
          model: Loan,
          where: { user_id: userId },
        },
      ],
    });

    if (!emis || emis.length === 0) {
      return { message: `No EMI records found for user ${userId}` };
    }

    return emis;
  }

  async getAllPayments(status?: string, loanId?: number, userId?: number) {
    const whereClause: any = {};

    if (status) whereClause.status = status;
    if (loanId) whereClause.loan_id = loanId;
    if (userId) whereClause.user_id = userId;

    return this.paymentModel.findAll({
      where: whereClause,
      include: [Emi],
    });
  }

  async getPaymentsForUser(userId: number) {
    const payments = await this.paymentModel.findAll({
      where: { user_id: userId },
    });

    if (!payments || payments.length === 0) {
      return raiseNotFound(`No payments found for userId ${userId}`);
    }

    return payments;
  }

  async updatePaymentStatus(body: {
    payment_id: number;
    status: 'PAID' | 'FAILED' | 'PENDING';
    remarks?: string;
  }) {
    const payment = await this.paymentModel.findByPk(body.payment_id);

    if (!payment) {
      return raiseNotFound(`Payment with id ${body.payment_id} not found`);
    }

    payment.status = body.status.toUpperCase() as PaymentStatusType;

    await payment.save();

    return { message: 'Payment status updated successfully', payment };
  }
}
