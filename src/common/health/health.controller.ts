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

  /**
   * Liveness check.
   *
   * Only verifies that the API Gateway process is alive.
   * It intentionally does not check downstream services or system resources.
   */
  @Get('live')
  @HealthCheck()
  live() {
    return this.health.check([]);
  }

  /**
   * Readiness check.
   *
   * Verifies that the gateway and its required dependencies
   * are healthy enough to receive traffic.
   */
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