// Imports
import { Emi } from '../emi/emi.model';
import { Payment } from './payment.model';
import { Loan } from '../loan/loan.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePaymentDto } from '../dto/createPayment.dto';
import { raiseBadReq, raiseNotFound } from '../config/error.config';
import { LoanStatus } from '@/common/enums/loanStatus.enum';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment) private paymentModel: typeof Payment,
    @InjectModel(Emi) private emiModel: typeof Emi,
    @InjectModel(Loan) private loanModel: typeof Loan,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto) {
    const { emi_id, amount, status } = createPaymentDto;

    // Find the EMI
    const emi = await this.emiModel.findByPk(emi_id);
    if (!emi) {
      return raiseNotFound(`EMI with ID ${emi_id} not found`);
    }

    // Check if already paid
    if (emi.status === 'Paid') {
      return raiseBadReq('EMI already paid');
    }

    // Create payment record
    const payment = await this.paymentModel.create({
      emi_id,
      amount_paid: amount,
      payment_date: new Date(),
      status,
    });

    // Update EMI
    await this.emiModel.update(
      { status: 'Paid', payment_date: new Date() },
      { where: { emi_id } },
    );

    // Check if all EMIs for this loan are paid
    const pendingEmis = await this.emiModel.count({
      where: { loan_id: emi.loan_id, status: 'Pending' },
    });

    if (pendingEmis === 0) {
      await this.loanModel.update(
        { status: LoanStatus.COMPLETED },
        { where: { loanId: emi.loan_id } },
      );
    }

    return { message: 'Payment successful', payment };
  }
}
