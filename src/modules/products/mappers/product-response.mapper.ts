import { grpcTimestampToIso } from '@common/utils';
import { Product as ProductGrpc } from '@ecommerce/contracts/generated/ecommerce/catalog/v1/catalog';
import { ProductResponseDto } from '../dto/product-response.dto';

export function toProductResponse(
  product: ProductGrpc,
): ProductResponseDto {
  return {
    id: product.id,
    name: product.name,
    description: product.description || undefined,
    price: product.price,
    categoryId: product.categoryId,
    userId: product.userId,

    category: product.category
      ? {
          id: product.category.id,
          name: product.category.name,
          description: product.category.description || undefined,
          createdAt: grpcTimestampToIso(product.category.createdAt),
          updatedAt: grpcTimestampToIso(product.category.updatedAt),
        }
      : undefined,

    createdAt: grpcTimestampToIso(product.createdAt),
    updatedAt: grpcTimestampToIso(product.updatedAt),
  };
}