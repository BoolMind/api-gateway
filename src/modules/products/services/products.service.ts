import { Injectable } from "@nestjs/common";

import { PageResponseDto, PaginationQueryDto } from "@common/dto";
import { toGrpcSortOrder } from "@common/utils";
import { ProductGrpcClient } from "@app-grpc/clients/product.grpc-client";

import { CreateProductDto, ProductResponseDto, UpdateProductDto } from "../dto";
import { toProductResponse } from "../mappers";

@Injectable()
export class ProductsService {
  constructor(private readonly productGrpcClient: ProductGrpcClient) {}

  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    const { product } = await this.productGrpcClient.create(dto);
    return toProductResponse(product!);
  }

  async getById(id: number): Promise<ProductResponseDto> {
    const { product } = await this.productGrpcClient.getById({ id });
    return toProductResponse(product!);
  }

  async update(id: number, dto: UpdateProductDto): Promise<ProductResponseDto> {
    const { product } = await this.productGrpcClient.update({
      id,
      ...dto,
    });
    return toProductResponse(product!);
  }

  async delete(id: number): Promise<void> {
    await this.productGrpcClient.delete({ id });
  }

  async restore(id: number): Promise<ProductResponseDto> {
    const { product } = await this.productGrpcClient.restore({ id });
    return toProductResponse(product!);
  }

  async paginate(
    query: PaginationQueryDto,
  ): Promise<PageResponseDto<ProductResponseDto>> {
    const { items, meta } = await this.productGrpcClient.paginate({
      page: query.page,
      limit: query.limit,
      search: query.search,
      orderBy: query.orderBy,
      order: toGrpcSortOrder(query.order),
    });

    return new PageResponseDto(items.map(toProductResponse), meta!);
  }

  async findByCategory(categoryId: number): Promise<ProductResponseDto[]> {
    const { items } = await this.productGrpcClient.findByCategory({
      categoryId,
    });
    return items.map(toProductResponse);
  }

  async findByUser(userId: number): Promise<ProductResponseDto[]> {
    const response = await this.productGrpcClient.findByUser({ userId });

    return (response?.items ?? []).map(toProductResponse);
  }
}
