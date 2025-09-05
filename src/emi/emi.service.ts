// Imports
import { Op } from 'sequelize';
import { Emi } from './emi.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from '../payment/payment.model';
import { raiseConflict, raiseNotFound } from '../config/error.config';

@Injectable()
export class EmiService {
  constructor(
    @InjectModel(Emi)
    private readonly emiModel: typeof Emi,

    @InjectModel(Payment)
    private readonly paymentModel: typeof Payment,
  ) {}

  async getEmiSchedule(loanId: number) {
    return this.emiModel.findAll({
      where: { loan_id: loanId },
      order: [['due_date', 'ASC']],
    });
  }

  async payEmi(emiId: number, paymentDate: Date = new Date()) {
    const emi = await this.emiModel.findByPk(emiId);
    if (!emi) return raiseNotFound('EMI Not Found');

    if (emi.status === 'Paid') {
      return raiseConflict(`EMI with id ${emiId} is already paid`);
    }

    const dueDate = new Date(emi.due_date as any);

    let lateFee = 0;
    if (paymentDate > dueDate) {
      const msPerDay = 1000 * 60 * 60 * 24;
      const daysLate = Math.ceil(
        (paymentDate.getTime() - dueDate.getTime()) / msPerDay,
      );
      const emiAmountNum = Number(emi.emi_amount) || 0;
      // 0.1% per day
      lateFee = emiAmountNum * 0.001 * daysLate;
      // round to 2 decimals
      lateFee = Math.round(lateFee * 100) / 100;
    }

    await this.emiModel.update(
      {
        status: 'Paid',
        payment_date: paymentDate,
        late_fee: lateFee,
      },
      { where: { emi_id: emiId } },
    );

    const updatedEmi = await this.emiModel.findOne({
      where: { emi_id: emiId },
    });

    if (!updatedEmi) {
      return raiseNotFound(`EMI with id ${emiId} not found`);
    }

    await this.paymentModel.create({
      user_id: updatedEmi.user_id,
      emi_id: updatedEmi.emi_id,
      amount_paid: updatedEmi.emi_amount,
      payment_date: paymentDate,
      payment_mode: 'UPI',
      status: 'PAID',
      transaction_id: ` `,
    });

    return updatedEmi;
  }

  async markOverdueEmis() {
    const today = new Date();
    await this.emiModel.update(
      { status: 'Overdue' },
      {
        where: {
          status: 'Pending',
          due_date: { [Op.lt]: today }, // due_date < today
        },
      },
    );
  }
}
