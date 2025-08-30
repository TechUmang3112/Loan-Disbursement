// Imports
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { Loan } from '../loan/loan.model';
import { EmiAttributes } from '../emi/emi.attributes';

export interface EmiCreationAttributes
  extends Optional<EmiAttributes, 'emi_id' | 'payment_date' | 'late_fee'> {}

@Table({ tableName: 'emi' })
export class Emi
  extends Model<EmiAttributes, EmiCreationAttributes>
  implements EmiAttributes
{
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare emi_id?: number;

  @ForeignKey(() => Loan)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare loan_id: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare emi_amount: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare due_date: Date;

  @Column({
    type: DataType.ENUM('Pending', 'Paid', 'Overdue'),
    allowNull: false,
    defaultValue: 'Pending',
  })
  declare status: 'Pending' | 'Paid' | 'Overdue';

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare payment_date?: Date;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  declare late_fee?: number;
}
