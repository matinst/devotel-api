import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { catchError, firstValueFrom, from, map, mergeMap } from "rxjs";

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
    return firstValueFrom(
      this.httpService.get(apiUrl).pipe(
        map((response) => response.data),
        mergeMap((jobs: any[]) => from(jobs)),
        map(async (job) => await this.jobTransformerService.transformJobData(job)),
        mergeMap(async (transformedJob) => from(this.jobRepository.upsert(await transformedJob, ["jobId"]))), // Store data
        catchError((error) => {
          console.error(`Error fetching jobs from ${source}:`, error.message);
          return from([]);
        }),
      ),
    );
  }

  //***************************** */
}
