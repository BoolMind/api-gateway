import { status as GrpcStatus } from '@grpc/grpc-js';
import {
  firstValueFrom,
  Observable,
  timeout,
  TimeoutError,
} from 'rxjs';

import { UpstreamGrpcException } from '../exceptions';

interface GrpcErrorLike {
  code?: unknown;
  details?: unknown;
  message?: unknown;
}

function isGrpcError(error: unknown): error is GrpcErrorLike {
  return typeof error === 'object' && error !== null;
}

export async function callGrpc<T>(
  source$: Observable<T>,
  options: { source: string; timeoutMs: number },
): Promise<T> {
  try {
    return await firstValueFrom(
      source$.pipe(timeout(options.timeoutMs)),
    );
  } catch (error) {
    /**
     * Client-side timeout.
     */
    if (error instanceof TimeoutError) {
      throw new UpstreamGrpcException(
        GrpcStatus.DEADLINE_EXCEEDED,
        `${options.source} did not respond within ${options.timeoutMs}ms`,
        options.source,
      );
    }

    /**
     * gRPC errors coming from the upstream microservice.
     */
    if (isGrpcError(error)) {
      console.log('========== API GATEWAY gRPC ERROR ==========');
      console.log('error:', error);
      console.log('error.code:', error.code);
      console.log('error.details:', error.details);
      console.log('error.message:', error.message);
      console.log('============================================');

      const code =
        typeof error.code === 'number'
          ? error.code
          : GrpcStatus.UNKNOWN;

      const message =
        typeof error.details === 'string'
          ? error.details
          : typeof error.message === 'string'
            ? error.message
            : 'Unknown upstream error';

      throw new UpstreamGrpcException(
        code,
        message,
        options.source,
      );
    }

    /**
     * Completely unexpected client-side error.
     */
    throw new UpstreamGrpcException(
      GrpcStatus.UNKNOWN,
      'Unknown upstream error',
      options.source,
    );
  }
}