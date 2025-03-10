export interface IJobDataV1 {
  jobId: string;
  title: string;
  details: {
    location: string;
    type: string;
    salaryRange: string;
  };
  company: {
    name: string;
    industry: string;
  };
  skills: string[];
  postedDate: string;
}

export interface IJobDataV2 {
  [name: string]: {
    position: string;
    location: {
      city: string;
      state: string;
      remote: boolean;
    };
    compensation: {
      min: number;
      max: number;
      currency: string;
    };
    employer: {
      companyName: string;
      website: string;
    };
    requirements: {
      experience: number;
      technologies: string[];
    };
    datePosted: string;
  };
}

export type ApiProvider = "provider1" | "provider2";
