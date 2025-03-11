export interface Provider1JobDetails {
  location: string;
  type: string;
  salaryRange: string;
}

export interface Provider1JobCompany {
  name: string;
  industry: string;
}

export interface Provider1Job {
  jobId: string;
  title: string;
  details: Provider1JobDetails;
  company: Provider1JobCompany;
  skills: string[];
  postedDate: string;
}

export interface Provider2JobLocation {
  city: string;
  state: string;
  remote: boolean;
}

export interface Provider2JobCompensation {
  min: number;
  max: number;
  currency: string;
}

export interface Provider2JobEmployer {
  companyName: string;
  industry: string;
  website: string;
}

export interface Provider2JobRequirements {
  technologies: string[];
}

export interface Provider2Job {
  jobId: string;
  position: string;
  location: Provider2JobLocation;
  compensation: Provider2JobCompensation;
  employer: Provider2JobEmployer;
  requirements: Provider2JobRequirements;
  details?: { type?: string };
  datePosted: string;
}
