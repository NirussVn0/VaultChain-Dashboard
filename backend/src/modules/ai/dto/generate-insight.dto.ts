import { IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";

export class GenerateInsightDto {
  @IsString()
  @IsNotEmpty()
  prompt!: string;

  @IsObject()
  @IsOptional()
  context?: Record<string, unknown>;
}
