import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';

import { callGrpc } from '@common/utils';
import type { GrpcClientsConfig } from '@config/index';

import {
  HealthCheckResponse,
  HealthServiceClient,
} from '@ecommerce/contracts/generated/ecommerce/common/v1/health';

@Injectable()
export class HealthGrpcClient implements OnModuleInit {
  private userHealthService!: HealthServiceClient;
  private catalogHealthService!: HealthServiceClient;

  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientGrpc,
    @Inject('CATALOG_SERVICE') private readonly catalogClient: ClientGrpc,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit(): void {
    this.userHealthService =
      this.userClient.getService<HealthServiceClient>('HealthService');
    this.catalogHealthService =
      this.catalogClient.getService<HealthServiceClient>('HealthService');
  }

  checkUserService(): Promise<HealthCheckResponse> {
    return this.probe(this.userHealthService, 'user-service.HealthService');
  }

  checkCatalogService(): Promise<HealthCheckResponse> {
    return this.probe(
      this.catalogHealthService,
      'catalog-service.HealthService',
    );
  }

  private probe(
    service: HealthServiceClient,
    source: string,
  ): Promise<HealthCheckResponse> {
    const { healthTimeoutMs } =
      this.configService.get<GrpcClientsConfig>('grpcClients')!;

    return callGrpc(service.check({}), {
      source,
      timeoutMs: healthTimeoutMs,
    });
  }
}
