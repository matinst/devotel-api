import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { catchError, from, map, mergeMap } from "rxjs";

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
    console.log(`Fetching jobs from ${source}..., apiUrl: ${apiUrl}`);

    return this.httpService.get(apiUrl).pipe(
      map((response) => {
        console.log(`Raw API Response from ${source}:`, JSON.stringify(response.data, null, 2));
        return response.data || {};
      }),
      mergeMap((jobs: any) => {
        if (!jobs || typeof jobs !== "object") {
          console.error(`Invalid job data structure from ${source}:`, jobs);
          return from([]);
        }

        if (Array.isArray(jobs.jobs)) {
          return from(jobs.jobs);
        } else if (jobs.jobsList && typeof jobs.jobsList === "object") {
          return from(
            Object.entries(jobs.jobsList).map(([id, job]) =>
              typeof job === "object" && job !== null ? { jobId: id, ...job } : { jobId: id },
            ),
          );
        } else {
          console.error(`Unexpected job data format from ${source}:`, jobs);
          return from([]);
        }
      }),
      mergeMap(async (job) => this.jobTransformerService.transformJobData(job)),
      mergeMap((transformedJob) => from(this.jobRepository.upsert(transformedJob, ["jobId"]))),
      catchError((error) => {
        console.error(`Error fetching jobs from ${source}:`, error.message);
        return from([]);
      }),
    );
  }

  //***************************** */
}
