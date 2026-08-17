/**
 * Wraps an error returned by a downstream gRPC call.
 *
 * Thrown by `callGrpc()` (see common/utils/grpc-call.util.ts) whenever a
 * gRPC client observable errors out. Caught exactly once, globally, by
 * `GrpcExceptionFilter`, which is the single place gRPC status codes are
 * translated into HTTP status codes. Controllers and facade services never
 * need to know about gRPC error shapes.
 */
export class UpstreamGrpcException extends Error {
  constructor(
    /** Numeric @grpc/grpc-js status code (e.g. 5 = NOT_FOUND). */
    public readonly grpcCode: number,
    message: string,
    /** Which downstream service raised this, for logging. */
    public readonly source?: string,
  ) {
    super(message);
    this.name = 'UpstreamGrpcException';
    Object.setPrototypeOf(this, UpstreamGrpcException.prototype);
  }
}
