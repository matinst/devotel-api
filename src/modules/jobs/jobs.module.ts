import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Job } from "./entities/job.entity";
import { JobService } from "./providers/jobs.service";
import { JobSchedulerService } from "./providers/jobsScheduler.service";
import { JobTransformerService } from "./providers/jobTransformer.service";
import { JobsRepository } from "./repositories/jobs.repository";
import { SalaryService } from "../utils/providers/salary.service";

@Module({
  imports: [TypeOrmModule.forFeature([Job]), ScheduleModule.forRoot()],
  providers: [JobService, JobsRepository, JobSchedulerService, JobTransformerService, SalaryService],
  controllers: [],
  exports: [],
})
export class JobsModule {}
