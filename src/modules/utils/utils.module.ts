import { Module } from "@nestjs/common";

import { SalaryService } from "./providers/salary.service";

@Module({
  providers: [SalaryService],
  exports: [SalaryService],
})
export class UtilsModule {}
