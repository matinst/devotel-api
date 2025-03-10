import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Job {
  @PrimaryColumn()
  jobId: string;

  @Column({ type: "varchar", length: 250 })
  title: string;

  @Column({ type: "text", nullable: true })
  location: string;

  @Column({ type: "varchar", length: 250, nullable: true })
  city: string | undefined;

  @Column({ type: "varchar", length: 250, nullable: true })
  state: string | undefined;

  @Column({ type: "boolean", default: false })
  remote: boolean;

  @Column({ type: "varchar", length: 100 })
  type: string;

  @Column({ type: "int", nullable: true })
  salaryMin: number;

  @Column({ type: "int", nullable: true })
  salaryMax: number;

  @Column({ type: "varchar", length: 50, nullable: true })
  currency: string;

  @Column({ type: "varchar", length: 300 })
  companyName: string;

  @Column({ type: "varchar", length: 200, nullable: true })
  industry: string | undefined;

  @Column({ type: "varchar", length: 300, nullable: true })
  website: string | undefined;

  @Column({ type: "int", nullable: true })
  experience: number | undefined;

  @Column("text", { array: true })
  skills: string[];

  @Column({ type: "timestamptz" })
  postedDate: Date;
}
