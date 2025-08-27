// Imports
import { Op } from 'sequelize';
import { User } from './users.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { raiseNotFound } from '../config/error.config';
import { UserStatus } from '../common/enums/userStatus.enum';
import { CryptoService } from '../common/utils/crypto.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly cryptoService: CryptoService,
  ) {}

  async isExist(email_hash: string, mobile_hash: string, user_name: string) {
    return this.userModel.findOne({
      attributes: ['email_hash', 'mobile_hash', 'user_name'],
      raw: true,
      where: {
        [Op.or]: [{ email_hash }, { mobile_hash }, { user_name }],
      },
    });
  }

  async createUser(data: {
    email: string;
    email_encrypted: string;
    email_hash: string;
    user_name: string;
    password: string;
    mobile_number: string;
    mobile_encrypted: string;
    mobile_hash: string;
    max_retry: number;
  }) {
    const hashedPassword = await this.cryptoService.hashPassword(data.password);

    return this.userModel.create({
      ...data,
      password: hashedPassword,
      user_status: UserStatus.REGISTRATION,
    } as any);
  }

  async findByEmail(email: string): Promise<User | null> {
    const emailHash = this.cryptoService.hashField(email);
    return this.findByEmailHash(emailHash);
  }

  async findByEmailHash(emailHash: string): Promise<User | null> {
    return this.userModel.findOne({
      raw: true,
      where: { email_hash: emailHash },
      attributes: [
        'id',
        'email_encrypted',
        'email_hash',
        'password',
        'user_name',
        'role',
        'is_email_verified',
        'is_mobile_verified',
        'otp_timer',
        'otp',
        'max_retry',
        'user_status',
        'mobile_encrypted',
        'mobile_hash',
      ],
    });
  }

  async updateUser(email: string, updates: Partial<User>) {
    const emailHash = this.cryptoService.hashField(email);
    return this.updateUserByHash(emailHash, updates);
  }

  async updateUserById(userId: number, updates: Partial<User>) {
    return this.userModel.update(updates, { where: { id: userId } });
  }

  async updateUserByHash(emailHash: string, updates: Partial<User>) {
    return this.userModel.update(updates, { where: { email_hash: emailHash } });
  }

  async getUserStatus(userId: number) {
    const user = await this.userModel.findByPk(userId);
    if (!user) return raiseNotFound('User not found');

    const steps = [
      { id: 1, label: 'Registration' },
      { id: 2, label: 'Basic Details' },
      { id: 3, label: 'KYC' },
      { id: 4, label: 'Salary Verification' },
      { id: 5, label: 'Loan Approved' },
      { id: 6, label: 'Disbursement' },
    ];

    const currentStatus = user.user_status;

    const NewSteps = steps.map((step) => ({
      ...step,
      isCompleted: step.id < currentStatus,
      isCurrent: step.id === currentStatus,
    }));

    const userName = user.user_name;

    return {
      userName,
      userId,
      currentStatus,
      steps: NewSteps,
    };
  }
}
