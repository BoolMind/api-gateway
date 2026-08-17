export interface PageMetaResponse {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export class PageResponseDto<T> {
  constructor(
    public readonly items: T[],
    public readonly meta: PageMetaResponse,
  ) {}
}
