// Imports
import { Op } from 'sequelize';
import { User } from './users.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserStatus } from '../common/enums/userStatus.enum';
import { raiseBadReq, raiseNotFound } from '../config/error.config';

@Injectable()
export class UsersService {
  // otp(arg0: { otp: string }) {
  //   throw raiseBadReq('Method not implemented.');
  // }

  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async isExist(email: string, mobile_number: string, user_name: string) {
    return await this.userModel.findOne({
      attributes: ['email', 'mobile_number', 'user_name'],
      raw: true,
      where: {
        [Op.or]: [{ email }, { mobile_number }, { user_name }],
      },
    });
  }

  async createUser(data: {
    email: string;
    password: string;
    user_name: string;
    mobile_number: string;
    otp: string;
    otp_timer: Date;
    max_retry: number;
  }) {
    return await this.userModel.create({
      ...data,
      user_status: UserStatus.REGISTRATION,
    } as any);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({
      raw: true,
      where: { email },
      attributes: [
        'id',
        'email',
        'password',
        'user_name',
        'role',
        'is_email_verified',
      ],
    });
  }

  async updateUser(email: string, updates: Partial<User>) {
    return await this.userModel.update(updates, {
      where: { email },
    });
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
