import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';

import { BaseGrpcCrudClient } from '../base/grpc-crud.client';
import type { GrpcClientsConfig } from '@config/index';

import {
  ProductServiceClient,
  ProductServiceFindByCategoryRequest,
  ProductServiceFindByCategoryResponse,
  ProductServiceFindByUserRequest,
  ProductServiceFindByUserResponse,
} from '@ecommerce/contracts/generated/ecommerce/catalog/v1/catalog';

@Injectable()
export class ProductGrpcClient extends BaseGrpcCrudClient<ProductServiceClient> {
  constructor(
    @Inject('CATALOG_SERVICE') client: ClientGrpc,
    configService: ConfigService,
  ) {
    const { callTimeoutMs } =
      configService.get<GrpcClientsConfig>('grpcClients')!;

    super(
      client,
      'ProductService',
      'catalog-service.ProductService',
      callTimeoutMs,
    );
  }

  findByCategory(
    request: ProductServiceFindByCategoryRequest,
  ): Promise<ProductServiceFindByCategoryResponse> {
    return this.call(this.service.findByCategory(request));
  }

  findByUser(
    request: ProductServiceFindByUserRequest,
  ): Promise<ProductServiceFindByUserResponse> {
    return this.call(this.service.findByUser(request));
  }
}
