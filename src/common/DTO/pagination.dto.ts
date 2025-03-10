import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from "class-validator";

export class PaginationDto {
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @ApiPropertyOptional({ type: "number", required: false })
  page?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  @ApiPropertyOptional({ type: "number", required: false })
  limit?: number;
}
