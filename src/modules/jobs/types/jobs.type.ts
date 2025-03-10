export type LocationType = {
  city: string;
  state: string;
  remote: boolean;
};

export type SalaryRangeType = {
  min: number;
  max: number;
  currency: string;
};

export type CompanyType = {
  name: string;
  industry: string;
  website: string;
};

export type UnifiedJobType = {
  jobId: string;
  title: string;
  location: LocationType;
  employmentType: string;
  salaryRange: SalaryRangeType;
  company: CompanyType;
  skills: string[];
  postedDate: string;
};
