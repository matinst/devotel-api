import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { EMPTY, catchError, filter, from, map, mergeMap, throwError } from "rxjs";

import { JobTransformerService } from "./jobTransformer.service";
import { PaginationUtils } from "../../utils/providers/pagination.utils";
import { JobsQueryDto } from "../DTO/jobs-query.dto";
import { Provider1Job, Provider2Job } from "../interfaces/IJob";
import { JobsRepository } from "../repositories/jobs.repository";
import { UnifiedJobType } from "../types/jobs.type";

@Injectable()
export class JobService {
  constructor(
    private readonly jobRepository: JobsRepository,
    private readonly jobTransformerService: JobTransformerService,
    private readonly httpService: HttpService,
  ) {}

  //***************************** */

  async getAllJobs(queryDto: JobsQueryDto) {
    const { limit, skip } = PaginationUtils(queryDto);

    const queryBuilder = this.jobRepository.createQueryBuilder("job");

    if (queryDto.jobTitle) {
      queryBuilder.andWhere("job.title ILIKE :query", { query: `%${queryDto.jobTitle}%` });
    }

    if (queryDto.location) {
      queryBuilder.andWhere("job.location->>'city' ILIKE :location", { location: `%${queryDto.location}%` });
    }

    if (queryDto.minSalary) {
      queryBuilder.andWhere("CAST(job.salary->>'min' AS NUMERIC) >= :minSalary", { minSalary: +queryDto.minSalary });
    }

    if (queryDto.maxSalary) {
      queryBuilder.andWhere("CAST(job.salary->>'max' AS NUMERIC) <= :maxSalary", { maxSalary: +queryDto.maxSalary });
    }

    const [jobs, count] = await queryBuilder.skip(skip).take(limit).getManyAndCount();

    return {
      jobs,
      count,
      pagination: true,
    };
  }

  //***************************** */

  fetchAndStoreJobsRx(apiUrl: string, source: string) {
    console.log(`Fetching jobs from ${source}... API URL: ${apiUrl}`);

    return this.httpService.get(apiUrl).pipe(
      catchError((error) => {
        console.error(`Failed to fetch jobs from ${source}: ${error.message}`);
        return throwError(() => new Error(`HTTP request failed for ${source}`));
      }),
      map((response) => this.handleApiResponse(response, source)),
      mergeMap((jobs: any) => this.extractJobList(jobs, source)),
      mergeMap(async (job) => this.transformJob(job as Provider1Job | Provider2Job, source)),
      filter((transformedJob) => transformedJob !== null),
      mergeMap((transformedJob) => this.saveJobToRepository(transformedJob)),
      catchError((error) => {
        console.error(`Unexpected error in job processing for ${source}:`, error);
        return EMPTY;
      }),
    );
  }

  //***************************** */

  private handleApiResponse(response: any, source: string) {
    if (!response || !response.data) {
      console.error(`Empty response data from ${source}`);
      throw new Error(`Invalid response from ${source}`);
    }
    return response.data;
  }

  //***************************** */

  private extractJobList(jobs: any, source: string) {
    if (!jobs || typeof jobs !== "object") {
      console.error(`Invalid job data format from ${source}:`, JSON.stringify(jobs, null, 2));
      return EMPTY;
    }

    let jobList = [];

    if (Array.isArray(jobs.jobs)) {
      jobList = jobs.jobs;
    } else if (jobs.data?.jobsList) {
      jobList = Object.entries(jobs.data.jobsList).map(([id, job]) =>
        typeof job === "object" && job !== null ? { jobId: id, ...job } : { jobId: id },
      );
    } else {
      console.error(`Unexpected job data structure from ${source}:`, JSON.stringify(jobs, null, 2));
      return EMPTY;
    }

    return from(jobList);
  }

  //***************************** */

  private async transformJob(job: Provider1Job | Provider2Job, source: string): Promise<UnifiedJobType | null> {
    try {
      return await this.jobTransformerService.transformJobData(job, source);
    } catch (error) {
      console.error(`Job transformation failed for ${source}:`, JSON.stringify(job, null, 2), error);
      return null;
    }
  }

  //***************************** */

  private saveJobToRepository(transformedJob: UnifiedJobType) {
    return from(this.jobRepository.upsert(transformedJob, ["jobId"])).pipe(
      catchError((error) => {
        console.error(`Error saving job to repository:`, JSON.stringify(transformedJob, null, 2), error);
        return EMPTY;
      }),
    );
  }

  //***************************** */
}
