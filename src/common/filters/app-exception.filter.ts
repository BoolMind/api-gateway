import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { GRPC_TO_HTTP_STATUS } from '../constants';
import { UpstreamGrpcException } from '../exceptions';
import { AppLogger } from '../logger/app.logger';

interface ErrorResponseBody {
  statusCode: number;
  error: string;
  message: string;
  path: string;
  timestamp: string;
}

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { statusCode, message } = this.resolve(exception);

    const body: ErrorResponseBody = {
      statusCode,
      error: HttpStatus[statusCode] ?? 'INTERNAL_SERVER_ERROR',
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url} -> ${statusCode}: ${message}`,
        exception instanceof Error ? exception.stack : undefined,
        'GrpcExceptionFilter',
      );
    }

    response.status(statusCode).json(body);
  }

  private resolve(exception: unknown): {
    statusCode: number;
    message: string;
  } {
    if (exception instanceof UpstreamGrpcException) {
      return {
        statusCode:
          GRPC_TO_HTTP_STATUS[exception.grpcCode] ??
          HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message,
      };
    }

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      const message =
        typeof res === 'string'
          ? res
          : ((res as { message?: string | string[] }).message ??
            exception.message);

      return {
        statusCode: exception.getStatus(),
        message: Array.isArray(message) ? message.join('; ') : message,
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error.',
    };
  }
}