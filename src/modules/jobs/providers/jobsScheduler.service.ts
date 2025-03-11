import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

import { JobService } from "./jobs.service";

@Injectable()
export class JobSchedulerService {
  constructor(private readonly jobService: JobService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  handleCron() {
    console.log("Running scheduled job fetch...");
    this.jobService.fetchAndStoreJobsRx("https://assignment.devotel.io/api/provider1/jobs", "provider1").subscribe();
    this.jobService.fetchAndStoreJobsRx("https://assignment.devotel.io/api/provider2/jobs", "provider2").subscribe();
  }

  triggerJobManually() {
    console.log("Manually triggered job fetch...");
    this.handleCron();
  }
}
