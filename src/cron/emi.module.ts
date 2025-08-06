// Imports
import { Module } from '@nestjs/common';
import { Loan } from '@/loan/loan.model';
import { User } from '@/users/users.model';
import { ScheduleModule } from '@nestjs/schedule';
import { SequelizeModule } from '@nestjs/sequelize';
import { EmiReminderService } from '@/cron/emiReminder.service';

@Module({
  imports: [ScheduleModule.forRoot(), SequelizeModule.forFeature([User, Loan])],
  providers: [EmiReminderService],
})
export class EmiReminderModule {}
