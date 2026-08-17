import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

import { HealthGrpcClient } from '@app-grpc/clients/health.grpc-client';

import { GrpcHealthIndicator } from './grpc-health.indicator';
import { SystemHealthIndicator } from './system-health.indicator';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly grpcHealth: GrpcHealthIndicator,
    private readonly systemHealth: SystemHealthIndicator,
    private readonly healthGrpcClient: HealthGrpcClient,
  ) {}

  @Get('live')
  @HealthCheck()
  live() {
    return this.health.check([]);
  }

  @Get('ready')
  @HealthCheck()
  ready() {
    return this.health.check([
      () =>
        this.grpcHealth.pingService('user-service', () =>
          this.healthGrpcClient.checkUserService(),
        ),

      () =>
        this.grpcHealth.pingService('catalog-service', () =>
          this.healthGrpcClient.checkCatalogService(),
        ),

      () => this.systemHealth.checkCpu(),

      () => this.systemHealth.checkMemory(),

      () => this.systemHealth.checkDisk(),
    ]);
  }
}