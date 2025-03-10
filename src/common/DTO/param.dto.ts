import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

import { CommonMessage } from "../enums/message.enum";

export class ParamDto {
  @IsNotEmpty({ message: CommonMessage.ID_REQUIRED })
  @IsUUID("4", { message: CommonMessage.ID_SHOULD_BE_UUID })
  @ApiProperty({ description: "Id of the entity", example: "8b1e8b1e-8b1e-8b1e-8b1e-8b1e8b1e8b1e" })
  id: string;
}

export class OptionalParamDto extends PartialType(ParamDto) {}

export class ParamNumberIdDto {
  @IsNotEmpty({ message: CommonMessage.ID_REQUIRED })
  @ApiProperty({ description: "Id of the entity", example: "20" })
  id: string;
}
