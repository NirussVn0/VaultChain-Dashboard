import { IsOptional, IsString, Length } from "class-validator";

export class AddAssetDto {
  @IsString()
  @Length(2, 32)
  symbol!: string;

  @IsOptional()
  @IsString()
  @Length(0, 280)
  notes?: string;
}
