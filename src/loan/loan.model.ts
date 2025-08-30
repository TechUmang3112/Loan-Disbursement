// Imports
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
  HasMany,
} from 'sequelize-typescript';
import { Emi } from '../emi/emi.model';
import { User } from '../users/users.model';
import { LoanStatus } from '../common/enums/loanStatus.enum';

@Table({ tableName: 'loan', timestamps: true })
export class Loan extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'loan_id',
  })
  declare loanId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'user_id' })
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;

  @HasMany(() => Emi)
  emis: Emi[];

  @Column({ type: DataType.FLOAT })
  declare amount: number;

  @Column({ type: DataType.FLOAT })
  declare monthly_emi: number;

  @Column({ type: DataType.INTEGER })
  declare tenure_months: number;

  @Column({
    type: DataType.SMALLINT,
    allowNull: false,
    defaultValue: LoanStatus.OFFERED,
  })
  declare status: LoanStatus;

  @Column({ type: DataType.DATE, allowNull: true })
  declare disbursed_on: Date;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
  declare disbursed_amount: number;

  @Default(3.0)
  @Column({ type: DataType.FLOAT, allowNull: false })
  declare interest_rate: number;

  @Column({ type: DataType.DATE, allowNull: true })
  declare next_emi_date: Date;
}
