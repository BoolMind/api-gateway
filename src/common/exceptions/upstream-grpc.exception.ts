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
