import { Injectable } from '@nestjs/common';

import { PageResponseDto, PaginationQueryDto } from '@common/dto';
import { toGrpcSortOrder } from '@common/utils';
import { CategoryGrpcClient } from '@app-grpc/clients/category.grpc-client';

import { CategoryResponseDto, CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { toCategoryResponse } from '../mappers';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryGrpcClient: CategoryGrpcClient) {}

  async create(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const { category } = await this.categoryGrpcClient.create(dto);
    return toCategoryResponse(category!);
  }

  async getById(id: number): Promise<CategoryResponseDto> {
    const { category } = await this.categoryGrpcClient.getById({ id });
    return toCategoryResponse(category!);
  }

  async findAll(): Promise<CategoryResponseDto[]> {
    const { items } = await this.categoryGrpcClient.findAll({});
    return items.map(toCategoryResponse);
  }

  async update(
    id: number,
    dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const { category } = await this.categoryGrpcClient.update({
      id,
      ...dto,
    });
    return toCategoryResponse(category!);
  }

  async delete(id: number): Promise<void> {
    await this.categoryGrpcClient.delete({ id });
  }

  async restore(id: number): Promise<CategoryResponseDto> {
    const { category } = await this.categoryGrpcClient.restore({ id });
    return toCategoryResponse(category!);
  }

  async paginate(
    query: PaginationQueryDto,
  ): Promise<PageResponseDto<CategoryResponseDto>> {
    const { items, meta } = await this.categoryGrpcClient.paginate({
      page: query.page,
      limit: query.limit,
      search: query.search,
      orderBy: query.orderBy,
      order: toGrpcSortOrder(query.order),
    });

    return new PageResponseDto(items.map(toCategoryResponse), meta!);
  }
}
