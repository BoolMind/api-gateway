import { grpcTimestampToIso } from '@common/utils';
import { Category as CategoryGrpc } from '@ecommerce/contracts/generated/ecommerce/catalog/v1/catalog';

import { CategoryResponseDto } from '../dto/category-response.dto';

export function toCategoryResponse(
  category: CategoryGrpc,
): CategoryResponseDto {
  return {
    id: category.id,
    name: category.name,
    description: category.description || undefined,
    createdAt: grpcTimestampToIso(category.createdAt),
    updatedAt: grpcTimestampToIso(category.updatedAt),
  };
}
