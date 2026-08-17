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
   
    if (error instanceof TimeoutError) {
      throw new UpstreamGrpcException(
        GrpcStatus.DEADLINE_EXCEEDED,
        `${options.source} did not respond within ${options.timeoutMs}ms`,
        options.source,
      );
    }

    if (isGrpcError(error)) {
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
    throw new UpstreamGrpcException(
      GrpcStatus.UNKNOWN,
      'Unknown upstream error',
      options.source,
    );
  }
}