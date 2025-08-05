import { EmiReminderService } from '@/cron/emiReminder.service';
import { Loan } from '@/loan/loan.model';
import { User } from '@/users/users.model';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [ScheduleModule.forRoot(), SequelizeModule.forFeature([User, Loan])],
  providers: [EmiReminderService],
})
export class EmiReminderModule {}
