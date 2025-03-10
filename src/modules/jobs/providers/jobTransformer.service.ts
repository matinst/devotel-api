import { Injectable } from "@nestjs/common";

import { SalaryService } from "../../utils/providers/salary.service";
import { ApiProvider, IJobDataV1, IJobDataV2 } from "../interfaces/IJob";

@Injectable()
export class JobTransformerService {
  constructor(private readonly salaryService: SalaryService) {}

  async transformJobData(job: IJobDataV1 | IJobDataV2, provider: ApiProvider) {
    switch (provider) {
      case "provider1":
        return this.transformProviderV1Data(job as IJobDataV1);

      case "provider2":
        return this.transformProviderV2Data(job as IJobDataV2);
      default:
        throw new Error("Unsupported API source");
    }
  }

  private async transformProviderV1Data(jobs: IJobDataV1) {
    return {
      jobId: jobs.jobId,
      title: jobs.title,
      location: jobs.details.location,
      city: undefined,
      state: undefined,
      remote: false,
      type: jobs.details.type,
      salaryMin: (await this.salaryService.parseSalary(jobs.details.salaryRange)).min,
      salaryMax: (await this.salaryService.parseSalary(jobs.details.salaryRange)).max,
      currency: "USD",
      companyName: jobs.company.name,
      industry: jobs.company.industry,
      website: undefined,
      experience: undefined,
      skills: jobs.skills,
      postedDate: new Date(jobs.postedDate),
    };
  }

  private async transformProviderV2Data(job: IJobDataV2) {
    return {
      jobId: job.id || `job-${job.position}`,
      title: job.position,
      location: `${job.location.city}, ${job.location.state}`,
      city: job.location.city,
      state: job.location.state,
      remote: job.location.remote,
      type: "Unknown",
      salaryMin: job.compensation.min,
      salaryMax: job.compensation.max,
      currency: job.compensation.currency,
      companyName: job.employer.companyName,
      industry: undefined,
      website: job.employer.website,
      experience: job.requirements.experience,
      skills: job.requirements.technologies,
      postedDate: new Date(job.datePosted),
    };
  }
}
