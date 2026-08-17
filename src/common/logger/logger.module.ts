import { Global, Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

import { AppLogger } from './app.logger';

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        autoLogging: true,
      },
    }),
  ],
  providers: [AppLogger],
  exports: [AppLogger],
})
export class LoggerModule {};
