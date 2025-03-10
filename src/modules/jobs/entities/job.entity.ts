import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from "typeorm";

import { CompanyType, LocationType, SalaryRangeType } from "../types/jobs.type";

@Entity()
@Unique(["jobId"])
export class Job {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column()
  jobId: string;

  @Column()
  title: string;

  @Column("jsonb")
  location: LocationType;

  @Column()
  employmentType: string;

  @Column("jsonb")
  salaryRange: SalaryRangeType;

  @Column("jsonb")
  company: CompanyType;

  @Column("text", { array: true })
  skills: string[];

  @Column()
  postedDate: string;
}
