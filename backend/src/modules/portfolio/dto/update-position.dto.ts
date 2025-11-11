import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, IsString, Length } from "class-validator";

export class UpdatePositionDto {
  @IsOptional()
  @IsString()
  @Length(2, 32)
  symbol?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  quantity?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  costBasis?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  averageEntryPrice?: number;

  @IsOptional()
  @IsString()
  @Length(0, 280)
  notes?: string;
}
