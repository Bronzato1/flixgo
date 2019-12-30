export interface IFilter {
  
  searchTerms?: string;
  
  pageSizeText?: string;
  pageSizeValue?: number;

  sortOrderText?: string;
  sortOrderValue?: string;

  releaseYearText?: string;
  releaseYearValue?: number;
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
