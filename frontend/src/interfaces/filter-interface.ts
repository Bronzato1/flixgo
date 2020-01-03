export interface IFilter {
  searchTerms?: string;
  playlistText?: string;
  playlistValue?: string;
  pageSizeText?: string;
  pageSizeValue?: number;
  sortOrderText?: string;
  sortOrderValue?: string;
  releaseYearStart?: number;
  releaseYearEnd?: number;
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
