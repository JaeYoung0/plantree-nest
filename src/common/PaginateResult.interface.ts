export interface PaginateResult<T> {
  data: T[];
  meta: { total: number; page: number; last_page: number };
}
