export type dataRecord = {
  basic_monthly_mean: string;
  basic_monthly_median: string;
  degree: string;
  employment_rate_ft_perm: string;
  employment_rate_overall: string;
  gross_monthly_mean: string;
  gross_monthly_median: string;
  gross_mthly_25_percentile: string;
  gross_mthly_75_percentile: string;
  school: string;
  university: string;
  year: string;
  _id: number;
};

export type dataStore = {
  help: string;
  result: {
    fields: { type: string; id: string }[];
    limit: number;
    records: dataRecord[];
    resource_id: string;
    sort: string;
    total: number;
    _links: { next: string; start: string };
  };
  success: boolean;
  year: number[];
};
