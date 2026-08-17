import { registerAs } from '@nestjs/config';

export interface AppConfig {
  httpPort: number;
  nodeEnv: string;
  logLevel: string;
}

export const appConfig = registerAs(
  'app',
  (): AppConfig => ({
    httpPort: Number(process.env.HTTP_PORT),
    nodeEnv: process.env.NODE_ENV ?? 'development',
    logLevel: process.env.LOG_LEVEL ?? 'log',
  }),
);
