import { IsOptional, IsString, Length } from "class-validator";

export class UpdateWatchlistDto {
  @IsOptional()
  @IsString()
  @Length(2, 64)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(0, 280)
  description?: string;
}
