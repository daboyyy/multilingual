export interface SearchMetadata {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface SearchResult {
  results: any[];
  meta: SearchMetadata;
}
