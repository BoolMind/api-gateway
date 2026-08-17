import { Injectable } from '@nestjs/common';

import { PageResponseDto, PaginationQueryDto } from '@common/dto';
import { toGrpcSortOrder } from '@common/utils';
import { UserGrpcClient } from '@app-grpc/clients/user.grpc-client';

import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../dto';
import { toUserResponse } from '../mappers';

@Injectable()
export class UsersService {
  constructor(private readonly userGrpcClient: UserGrpcClient) {}

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const { user } = await this.userGrpcClient.create(dto);
    return toUserResponse(user!);
  }

  async getById(id: number): Promise<UserResponseDto> {
    const { user } = await this.userGrpcClient.getById({ id });
    return toUserResponse(user!);
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserResponseDto> {
    const { user } = await this.userGrpcClient.update({ id, ...dto });
    return toUserResponse(user!);
  }

  async delete(id: number): Promise<void> {
    await this.userGrpcClient.delete({ id });
  }

  async restore(id: number): Promise<UserResponseDto> {
    const { user } = await this.userGrpcClient.restore({ id });
    return toUserResponse(user!);
  }

  async paginate(
    query: PaginationQueryDto,
  ): Promise<PageResponseDto<UserResponseDto>> {
    const { items, meta } = await this.userGrpcClient.paginate({
      page: query.page,
      limit: query.limit,
      search: query.search,
      orderBy: query.orderBy,
      order: toGrpcSortOrder(query.order),
    });

    return new PageResponseDto(items.map(toUserResponse), meta!);
  }
}
