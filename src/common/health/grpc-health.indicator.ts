import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';

import { HealthCheckResponse_ServingStatus } from '@ecommerce/contracts/generated/ecommerce/common/v1/health';

type HealthProbe = () => Promise<{
  status: HealthCheckResponse_ServingStatus;
}>;

@Injectable()
export class GrpcHealthIndicator extends HealthIndicator {
  async pingService(
    key: string,
    probe: HealthProbe,
  ): Promise<HealthIndicatorResult> {
    try {
      const response = await probe();

      if (response.status !== HealthCheckResponse_ServingStatus.SERVING) {
        throw new Error(
          `Service returned status ${
            HealthCheckResponse_ServingStatus[response.status]
          }`,
        );
      }

      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError(
        `${key} health check failed`,
        this.getStatus(key, false, {
          message: error instanceof Error ? error.message : 'Unknown error',
        }),
      );
    }
  }
}