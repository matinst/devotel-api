import { Injectable } from "@nestjs/common";

import { Provider1Job, Provider2Job } from "../interfaces/IJob";
import { UnifiedJobType } from "../types/jobs.type";

@Injectable()
export class JobTransformerService {
  async transformJobData(job: Provider1Job | Provider2Job, provider: string): Promise<UnifiedJobType> {
    switch (provider) {
      case "provider1":
        return this.transformProvider1Job(job as Provider1Job);
      case "provider2":
        return this.transformProvider2Job(job as Provider2Job);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  private async transformProvider1Job(job: Provider1Job): Promise<UnifiedJobType> {
    if (!job.jobId || !job.details) {
      throw new Error("Invalid job format for provider1");
    }

    const [city, state] = job.details.location.split(", ").map((s: string) => s.trim());
    const [minSalary, maxSalary] = job.details.salaryRange
      .replace(/\$|k/g, "")
      .split(" - ")
      .map((value: string) => Number(value) * 1000);

    return {
      jobId: job.jobId,
      title: job.title,
      location: { city, state, remote: false },
      employmentType: job.details.type || "Unknown",
      salary: { min: minSalary, max: maxSalary, currency: "USD" },
      company: {
        name: job.company.name,
        industry: job.company.industry || "Unknown",
        website: "Unknown",
      },
      skills: job.skills || [],
      postedDate: job.postedDate,
    };
  }

  private async transformProvider2Job(job: Provider2Job): Promise<UnifiedJobType> {
    if (!job.jobId || !job.position || !job.location || !job.compensation || !job.employer) {
      throw new Error(`Invalid job format for provider2: Missing required fields`);
    }

    if (!job.location.city || !job.location.state) {
      throw new Error(`Invalid job format for provider2: Missing location fields`);
    }

    return {
      jobId: job.jobId,
      title: job.position,
      location: {
        city: job.location.city,
        state: job.location.state,
        remote: job.location.remote || false,
      },
      employmentType: job.details?.type || "Unknown",
      salary: {
        min: job.compensation.min || 0,
        max: job.compensation.max || 0,
        currency: job.compensation.currency || "USD",
      },
      company: {
        name: job.employer.companyName || "Unknown",
        industry: job.employer.industry || "Unknown",
        website: job.employer.website || "Unknown",
      },
      skills: job.requirements?.technologies || [],
      postedDate: job.datePosted,
    };
  }
}
