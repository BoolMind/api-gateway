import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientGrpc } from "@nestjs/microservices";

import { BaseGrpcCrudClient } from "../base/grpc-crud.client";
import type { GrpcClientsConfig } from "@config/index";

import {
  CategoryServiceClient,
  CategoryServiceFindAllRequest,
  CategoryServiceFindAllResponse,
} from "@ecommerce/contracts/generated/ecommerce/catalog/v1/catalog";

@Injectable()
export class CategoryGrpcClient extends BaseGrpcCrudClient<CategoryServiceClient> {
  constructor(
    @Inject("CATALOG_SERVICE") client: ClientGrpc,
    configService: ConfigService,
  ) {
    const { callTimeoutMs } =
      configService.get<GrpcClientsConfig>("grpcClients")!;

    super(
      client,
      "CategoryService",
      "catalog-service.CategoryService",
      callTimeoutMs,
    );
  }

  findAll(
    request: CategoryServiceFindAllRequest = {},
  ): Promise<CategoryServiceFindAllResponse> {
    return this.call(this.service.findAll(request));
  }
}
