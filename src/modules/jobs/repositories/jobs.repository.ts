import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Job } from "../entities/job.entity";

@Injectable()
export class JobsRepository extends Repository<Job> {
  constructor(@InjectRepository(Job) jobRepository: Repository<Job>) {
    super(jobRepository.target, jobRepository.manager, jobRepository.queryRunner);
  }
}
