import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

/**
 * HTTP-layer sort direction. Deliberately a plain 'asc' | 'desc' string
 * for a clean REST query-param API — the mapping to the protobuf
 * SortOrder enum happens once, in each facade service.
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Shared query-string DTO for every `GET /<resource>` paginate endpoint.
 *
 * This only validates HTTP-layer concerns (types, coercion, bounds that
 * make sense at the edge). It intentionally does NOT re-declare every
 * protobuf validation rule — the microservice's protovalidate rules
 * remain the source of truth and any violation they raise is surfaced
 * to the client as a 400 via GrpcExceptionFilter.
 */
export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  orderBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: SortDirection;
}
