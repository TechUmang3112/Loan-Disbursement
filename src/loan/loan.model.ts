// Imports
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  AutoIncrement,
  Default,
} from 'sequelize-typescript';
import { User } from '../users/users.model';
import { LoanStatus } from '@/common/enums/loanStatus.enum';

@Table({ tableName: 'loans' })
export class Loan extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  loan_id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @Column({ type: DataType.FLOAT })
  amount: number;

  @Column({ type: DataType.FLOAT })
  monthly_emi: number;

  @Column({ type: DataType.INTEGER })
  tenure_months: number;

  @Column({
    type: DataType.SMALLINT,
    allowNull: false,
    defaultValue: LoanStatus.OFFERED,
  })
  status: LoanStatus;

  @Column({ type: DataType.DATE, allowNull: true })
  disbursed_on: Date;

  @Default(3.0)
  @Column({ type: DataType.FLOAT, allowNull: false })
  declare interest_rate: number;

  @Column({ type: DataType.DATE, allowNull: true })
  declare next_emi_date: Date;
}
