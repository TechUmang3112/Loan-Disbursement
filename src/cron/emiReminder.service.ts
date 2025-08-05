import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { Loan } from '../loan/loan.model';
import { User } from '../users/users.model';

@Injectable()
export class EmiReminderService {
  private readonly logger = new Logger(EmiReminderService.name);

  constructor(
    @InjectModel(Loan) private loanModel: typeof Loan,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleEmiReminders() {
    const today = new Date();
    const todayDay = today.getDate();

    this.logger.log(`Checking EMI reminders for day: ${todayDay}`);

    const users = await this.userModel.findAll({
      where: {
        emi_due_day: todayDay,
      },
      include: [
        {
          model: this.loanModel,
          where: {
            status: 1,
          },
        },
      ],
    });

    for (const user of users) {
      const loans = user['Loans'] || [];
      for (const loan of loans) {
        this.logger.log(
          `EMI Reminder: User ${user.full_name} (ID: ${user.id}) has EMI due today for Loan ID ${loan.loan_id}`,
        );
      }
    }
  }
}
