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
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { Kyc } from '../kyc/kyc.model';
import { User } from '../users/users.model';

export interface UploadAttributes {
  id: number;
  kycId: number;
  userId?: number | null;
  tag: string;
  originalName: string;
  path: string;
  mimeType: string;
  size: number;
  created_at?: Date;
  updated_at?: Date;
}

export type UploadCreationAttributes = Optional<
  UploadAttributes,
  'id' | 'userId' | 'created_at' | 'updated_at'
>;

@Table({
  tableName: 'uploads',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Upload extends Model<UploadAttributes, UploadCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => Kyc)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'kyc_id' })
  declare kycId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true, field: 'user_id' })
  declare userId: number | null;

  @Column({ type: DataType.STRING, allowNull: false })
  declare tag: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'original_name' })
  declare originalName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare path: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'mime_type' })
  declare mimeType: string;

  @Column({ type: DataType.BIGINT, allowNull: false })
  declare size: number;

  @BelongsTo(() => Kyc)
  declare kyc: Kyc;

  @BelongsTo(() => User)
  declare user: User;
}
