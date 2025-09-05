// Imports
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Unique,
} from 'sequelize-typescript';
import { Emi } from '../emi/emi.model';
import { User } from '../users/users.model';

export type PaymentModeType = 'UPI' | 'CARD' | 'NETBANKING' | 'CASH';
export type PaymentStatusType = 'PENDING' | 'PAID' | 'FAILED';

@Table({ tableName: 'payments', timestamps: true })
export class Payment extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare payment_id?: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare user_id: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Emi)
  @Unique('one_payment_per_emi')
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare emi_id: number;

  @BelongsTo(() => Emi)
  declare emi?: Emi;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  declare amount_paid: string;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  declare payment_date?: Date;

  @Column({
    type: DataType.ENUM('UPI', 'CARD', 'NETBANKING'),
    allowNull: true,
    defaultValue: 'UPI',
  })
  declare payment_mode: PaymentModeType;

  @Column({
    type: DataType.ENUM('PENDING', 'PAID', 'FAILED'),
    allowNull: false,
    defaultValue: 'PENDING',
  })
  declare status: PaymentStatusType;

  @Column({ type: DataType.STRING, allowNull: true })
  declare transaction_id?: string | null;
}
