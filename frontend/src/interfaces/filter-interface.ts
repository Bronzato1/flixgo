export interface IFilter {
  searchTerms?: string;
  pageSize?: number;
  sortOrder?: string;
  releaseYear?: number;
}

export interface IPager {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  startPage: number;
  endPage: number;
  startIndex: number;
  endIndex: number;
  pages: Array<number>;
}
