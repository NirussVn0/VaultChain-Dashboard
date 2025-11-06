import { IsInt, IsOptional, Max, Min } from "class-validator";

export class OrderBookQueryDto {
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(500)
  limit?: number;
}
