import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class AppLogger {
  constructor(private readonly logger: PinoLogger) {}

  log(message: string, context?: string): void {
    this.logger.info(
      context ? { context } : undefined,
      message,
    );
  }

  error(message: string, stack?: string, context?: string): void {
    this.logger.error(
      {
        ...(context ? { context } : {}),
        ...(stack ? { stack } : {}),
      },
      message,
    );
  }

  warn(message: string, context?: string): void {
    this.logger.warn(
      context ? { context } : undefined,
      message,
    );
  }

  debug(message: string, context?: string): void {
    this.logger.debug(
      context ? { context } : undefined,
      message,
    );
  }

  verbose(message: string, context?: string): void {
    this.logger.trace(
      context ? { context } : undefined,
      message,
    );
  }
}
