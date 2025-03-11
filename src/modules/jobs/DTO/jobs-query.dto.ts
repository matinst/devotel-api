import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

import { PaginationDto } from "../../../common/DTO/pagination.dto";
import { JobMessage } from "../../../common/enums/message.enum";

export class JobsQueryDto extends PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ description: "Minimum salary range", example: 0 })
  minSalary?: number;

  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ description: "Maximum salary range", example: 5000000 })
  maxSalary?: number;

  @IsOptional()
  @IsString({ message: JobMessage.SEARCH_QUERY_STRING })
  @ApiPropertyOptional({ description: "Search query", example: "search query" })
  jobTitle?: string;

  @IsOptional()
  @IsString({ message: JobMessage.SEARCH_QUERY_STRING })
  @ApiPropertyOptional({ description: "Location query", example: "New York" })
  location?: string;
}
