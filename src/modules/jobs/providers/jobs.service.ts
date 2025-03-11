import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { EMPTY, catchError, filter, from, map, mergeMap, throwError } from "rxjs";

import { JobTransformerService } from "./jobTransformer.service";
import { JobsRepository } from "../repositories/jobs.repository";

@Injectable()
export class JobService {
  constructor(
    private readonly jobRepository: JobsRepository,
    private readonly jobTransformerService: JobTransformerService,
    private readonly httpService: HttpService,
  ) {}

  //***************************** */

  fetchAndStoreJobsRx(apiUrl: string, source: string) {
    console.log(`Fetching jobs from ${source}... API URL: ${apiUrl}`);

    return this.httpService.get(apiUrl).pipe(
      catchError((error) => {
        console.error(`Failed to fetch jobs from ${source}: ${error.message}`);
        return throwError(() => new Error(`HTTP request failed for ${source}`));
      }),
      map((response) => {
        if (!response || !response.data) {
          console.error(`Empty response data from ${source}`);
          throw new Error(`Invalid response from ${source}`);
        }
        return response.data;
      }),
      mergeMap((jobs: any) => {
        if (!jobs || typeof jobs !== "object") {
          console.error(`Invalid job data format from ${source}:`, JSON.stringify(jobs, null, 2));
          return EMPTY;
        }

        let jobList: any[] = [];

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
      }),
      mergeMap(async (job) => {
        try {
          return await this.jobTransformerService.transformJobData(job, source);
        } catch (error) {
          console.error(`Job transformation failed for ${source}:`, JSON.stringify(job, null, 2), error);
          return null;
        }
      }),
      filter((transformedJob) => transformedJob !== null),
      mergeMap((transformedJob) =>
        from(this.jobRepository.upsert(transformedJob, ["jobId"])).pipe(
          catchError((error) => {
            console.error(`Error saving job to repository:`, JSON.stringify(transformedJob, null, 2), error);
            return EMPTY;
          }),
        ),
      ),
      catchError((error) => {
        console.error(`Unexpected error in job processing for ${source}:`, error);
        return EMPTY;
      }),
    );
  }

  //***************************** */
}
