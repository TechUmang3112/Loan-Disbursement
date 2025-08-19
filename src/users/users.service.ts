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
    const user = await this.userModel.findByPk(userId, {
      raw: true,
      attributes: ['id', 'user_name', 'email_encrypted', 'user_status'],
    });

    if (!user) throw raiseNotFound('User not found');

    const emailPlain = user.email_encrypted
      ? this.cryptoService.decryptField(user.email_encrypted)
      : null;

    return {
      id: user.id,
      name: user.user_name,
      email: emailPlain,
      status_code: user.user_status,
      status_label: UserStatus[user.user_status],
    };
  }
}
