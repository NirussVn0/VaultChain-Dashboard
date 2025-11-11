import { IsOptional, IsString, Length } from "class-validator";

export class CreatePortfolioDto {
  @IsString()
  @Length(2, 64)
  name!: string;

  @IsString()
  @Length(3, 12)
  @IsOptional()
  baseCurrency?: string;

  @IsOptional()
  @IsString()
  @Length(0, 280)
  description?: string;
}
