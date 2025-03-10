import { Injectable } from "@nestjs/common";

import { UnifiedJobType } from "../types/jobs.type";

@Injectable()
export class JobTransformerService {
  async transformJobData(job: any): Promise<UnifiedJobType> {
    if (job.jobsList) {
      const jobId = Object.keys(job.jobsList)[0];
      const jobData = job.jobsList[jobId];

      return {
        jobId,
        title: jobData.position,
        location: {
          city: jobData.location.city,
          state: jobData.location.state,
          remote: jobData.location.remote,
        },
        employmentType: "Full-Time",
        salaryRange: {
          min: jobData.compensation.min,
          max: jobData.compensation.max,
          currency: jobData.compensation.currency,
        },
        company: {
          name: jobData.employer.companyName,
          industry: "Unknown",
          website: jobData.employer.website,
        },
        skills: jobData.requirements.technologies,
        postedDate: jobData.datePosted,
      };
    }

    if (job.jobId) {
      const jobData = job;

      if (!jobData.details || !jobData.details.location || !jobData.details.salaryRange) {
        console.error(`Missing critical fields in job data from provider2: ${JSON.stringify(jobData)}`);
        throw new Error("Missing required fields in job data from provider2");
      }

      const [city, state] = jobData.details.location.split(", ").map((s: string) => s.trim());

      const [minSalary, maxSalary] = jobData.details.salaryRange
        .replace(/\$|k/g, "")
        .split(" - ")
        .map((value: string) => Number(value) * 1000);

      return {
        jobId: jobData.jobId,
        title: jobData.title,
        location: {
          city,
          state,
          remote: false,
        },
        employmentType: jobData.details.type,
        salaryRange: {
          min: minSalary,
          max: maxSalary,
          currency: "USD",
        },
        company: {
          name: jobData.company.name,
          industry: jobData.company.industry,
          website: "Unknown",
        },
        skills: jobData.skills,
        postedDate: jobData.postedDate,
      };
    }

    throw new Error("Unrecognized job format");
  }
}
