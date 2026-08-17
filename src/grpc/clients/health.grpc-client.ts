import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';

import { callGrpc } from '@common/utils';
import type { GrpcClientsConfig } from '@config/index';

// NOTE: assumes health.proto exports a `HealthServiceClient` interface
// (ts-proto nestJs=true) with a `check` method — verify after
// `npm run proto:generate`, same caveat as the other grpc clients.
import {
  HealthCheckResponse,
  HealthServiceClient,
} from '@ecommerce/contracts/generated/ecommerce/common/v1/health';

/**
 * Calls the real HealthService.Check RPC (the same one catalog-service and
 * user-service already implement) on both downstream connections.
 *
 * This assumes both services' main.ts bootstrap their gRPC microservice
 * with BOTH their own package (ecommerce.user.v1 / ecommerce.catalog.v1)
 * AND ecommerce.common.v1 on the same port — see GrpcClientsModule, which
 * registers protoPath/package as arrays for exactly this. If a service
 * only serves its own package, Check will return UNIMPLEMENTED and this
 * needs its own dedicated connection instead.
 */
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
