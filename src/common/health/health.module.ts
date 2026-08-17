import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";

import { GrpcClientsModule } from "@app-grpc/grpc-clients.module";

import { GrpcHealthIndicator } from "./grpc-health.indicator";
import { HealthController } from "./health.controller";
import { SystemHealthIndicator } from "./system-health.indicator";

@Module({
  imports: [TerminusModule, GrpcClientsModule],
  controllers: [HealthController],
  providers: [GrpcHealthIndicator, SystemHealthIndicator],
})
export class HealthModule {}
