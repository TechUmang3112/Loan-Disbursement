// Imports
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { User } from '..//users/users.model';
import { Upload } from '../uploads/upload.model';

export interface KycAttributes {
  id: number;
  userId: number;
  status: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type KycCreationAttributes = Optional<
  KycAttributes,
  'id' | 'status' | 'createdAt' | 'updatedAt'
>;

@Table({
  tableName: 'kyc',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Kyc extends Model<KycAttributes, KycCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'user_id' })
  declare userId: number;

  @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: 0 })
  declare status: number;

  @BelongsTo(() => User)
  declare user: User;

  @HasMany(() => Upload)
  declare uploads: Upload[];

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare salary_credit_day: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare emi_due_day: number;
}
