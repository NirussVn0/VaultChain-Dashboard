import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, IsString, Length } from "class-validator";

export class CreatePositionDto {
  @IsString()
  @Length(2, 32)
  symbol!: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  quantity!: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  costBasis!: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  averageEntryPrice!: number;

  @IsOptional()
  @IsString()
  @Length(0, 280)
  notes?: string;
}
