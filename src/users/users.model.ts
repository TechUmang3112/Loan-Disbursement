//imports
import { UserAttributes } from '@/users/users.attributes';
import { SmallIntegerDataType } from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'users' })
export class User extends Model<UserAttributes> implements UserAttributes {
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare user_name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare mobile_number: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare otp: string | null;

  @Column({ type: DataType.DATE, allowNull: true })
  declare otp_timer: Date | null;

  @Column({ type: DataType.SMALLINT, defaultValue: 0 })
  declare is_email_verified: number;

  @Column({ type: DataType.SMALLINT, defaultValue: 0 })
  declare is_mobile_verified: number;

  @Column({ type: DataType.SMALLINT, defaultValue: 0 })
  declare max_retry: number;

  @Column({ type: DataType.STRING, allowNull: true })
  declare address: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare aadhar_number: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare pan_number: string;

  @Column({ type: DataType.SMALLINT, defaultValue: 0 })
  declare is_pan_verified: number;
}
