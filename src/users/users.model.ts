// Imports
import { UserAttributes } from '../users/users.attributes';
import { KycStatus } from '../common/enums/kycStatus.enum';
import { UserStatus } from '../common/enums/userStatus.enum';
import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { VerificationStatus } from '../common/enums/verificationsStatus.enum';

@Table({ tableName: 'users' })
export class User extends Model<UserAttributes> implements UserAttributes {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: number;

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

  @Column({ type: DataType.STRING, allowNull: true })
  declare full_name: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare salary_statement_path: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare company_name: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
  declare loan_amount: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
  declare disbursed_amount: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
  declare salary: number;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  declare dob: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  declare gender: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare aadhar_card_path: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare pan_card_path: string;

  @Column({ type: DataType.SMALLINT, defaultValue: KycStatus.Pending })
  declare kyc_status: KycStatus;

  @Column({
    type: DataType.SMALLINT,
    defaultValue: VerificationStatus.NOT_VERIFIED,
  })
  declare is_aadhar_verified: VerificationStatus;

  @Column({
    type: DataType.SMALLINT,
    defaultValue: VerificationStatus.NOT_VERIFIED,
  })
  declare is_pan_verified: VerificationStatus;

  @Column({ type: DataType.SMALLINT, allowNull: true })
  declare tenure_months: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare salary_credit_day: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare emi_due_day: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: UserStatus.REGISTRATION,
  })
  declare user_status: UserStatus;

  @Column({ type: DataType.SMALLINT, defaultValue: 0 })
  declare salary_verified: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'user',
  })
  declare role: string;
}
