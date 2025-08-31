// Imports
import { Type } from 'class-transformer';
import { EmiStatus } from '../common/enums/emiStatus.enum';
import { IsOptional, IsEnum, IsInt, IsDateString, Min } from 'class-validator';

export class GetEmisDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  loanId?: number;

  @IsOptional()
  @IsEnum(EmiStatus)
  status?: EmiStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;

  @IsOptional()
  @IsDateString()
  dueDateFrom?: string;

  @IsOptional()
  @IsDateString()
  dueDateTo?: string;
}
