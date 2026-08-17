import { SortOrder } from '@ecommerce/contracts/generated/ecommerce/common/v1/common';
import type { SortDirection } from '../dto/pagination-query.dto';

export function toGrpcSortOrder(direction?: SortDirection): SortOrder {
  switch (direction) {
    case 'asc':
      return SortOrder.SORT_ORDER_ASC;
    case 'desc':
      return SortOrder.SORT_ORDER_DESC;
    default:
      return SortOrder.SORT_ORDER_UNSPECIFIED;
  }
}
