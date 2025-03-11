import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

import { JobsQueryDto } from "./DTO/jobs-query.dto";
import { JobService } from "./providers/jobs.service";

@Controller("jobs")
export class JobsController {
  constructor(private readonly jobService: JobService) {}

  //***************************** */

  @ApiOperation({ summary: "get all jobs" })
  @Get()
  async getAllJobs(@Query() queryDto: JobsQueryDto) {
    return this.jobService.getAllJobs(queryDto);
  }

  //***************************** */
}
