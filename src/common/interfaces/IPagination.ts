export interface IPageFormat {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  prevPage: string | boolean;
  nextPage: string | boolean;
}
