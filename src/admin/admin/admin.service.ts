// Imports
import { User } from 'users/users.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserStatus } from 'common/enums/userStatus.enum';
import { raiseNotFound, sendOk } from 'config/error.config';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
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

    return sendOk('User salary verification status updated successfully');
  }

  async getUserStatus(userId: number) {
    const user = await this.userModel.findByPk(userId, {
      attributes: ['id', 'user_name', 'email', 'user_status'],
    });

    if (!user) {
      throw raiseNotFound('User not found');
    }

    return {
      id: user.id,
      name: user.user_name,
      email: user.email,
      status_code: user.user_status,
      status_label: UserStatus[user.user_status],
    };
  }
}
