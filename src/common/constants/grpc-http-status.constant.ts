import { status as GrpcStatus } from '@grpc/grpc-js';
import { HttpStatus } from '@nestjs/common';

/**
 * Maps every gRPC status code to the HTTP status code the gateway should
 * return to REST clients. Keep this exhaustive — any gRPC status a
 * microservice can legitimately return must have an entry here, and
 * anything unmapped falls back to 500 (see grpc-exception.filter.ts).
 */
export const GRPC_TO_HTTP_STATUS: Record<number, HttpStatus> = {
  [GrpcStatus.OK]: HttpStatus.OK,
  [GrpcStatus.CANCELLED]: HttpStatus.INTERNAL_SERVER_ERROR,
  [GrpcStatus.UNKNOWN]: HttpStatus.INTERNAL_SERVER_ERROR,
  [GrpcStatus.INVALID_ARGUMENT]: HttpStatus.BAD_REQUEST,
  [GrpcStatus.DEADLINE_EXCEEDED]: HttpStatus.GATEWAY_TIMEOUT,
  [GrpcStatus.NOT_FOUND]: HttpStatus.NOT_FOUND,
  [GrpcStatus.ALREADY_EXISTS]: HttpStatus.CONFLICT,
  [GrpcStatus.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
  [GrpcStatus.RESOURCE_EXHAUSTED]: HttpStatus.TOO_MANY_REQUESTS,
  [GrpcStatus.FAILED_PRECONDITION]: HttpStatus.UNPROCESSABLE_ENTITY,
  [GrpcStatus.ABORTED]: HttpStatus.CONFLICT,
  [GrpcStatus.OUT_OF_RANGE]: HttpStatus.BAD_REQUEST,
  [GrpcStatus.UNIMPLEMENTED]: HttpStatus.NOT_IMPLEMENTED,
  [GrpcStatus.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
  [GrpcStatus.UNAVAILABLE]: HttpStatus.SERVICE_UNAVAILABLE,
  [GrpcStatus.DATA_LOSS]: HttpStatus.INTERNAL_SERVER_ERROR,
  [GrpcStatus.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
};
