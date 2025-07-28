// Imports
import { Op } from 'sequelize';
import { User } from './users.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UsersService {
  otp(arg0: { otp: string }) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async isExist(email: string, mobile_number: string, user_name: string) {
    const existing_user = await this.userModel.findOne({
      attributes: ['email', 'mobile_number', 'user_name'],
      raw: true,
      where: { [Op.or]: [{ email }, { mobile_number }, { user_name }] },
    });

    return existing_user;
  }

  async createUser(data: {
    email: string;
    password: string;
    user_name: string;
    mobile_number: string;
    otp: string;
    otp_timer: Date;
    max_retry: number;
    address: string;
    aadhar_number: string;
    pan_number: string;
  }) {
    return this.userModel.create(data as any);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ raw: true, where: { email } });
  }

  async updateUser(email: string, updates: Partial<User>) {
    return this.userModel.update(updates, { where: { email } });
  }
}
