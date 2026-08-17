import { registerAs } from '@nestjs/config';

export interface GrpcServiceEndpoint {
  host: string;
  port: number;
}

export interface GrpcClientsConfig {
  user: GrpcServiceEndpoint;
  catalog: GrpcServiceEndpoint;
  callTimeoutMs: number;
  healthTimeoutMs: number;
}

export const grpcClientsConfig = registerAs(
  'grpcClients',
  (): GrpcClientsConfig => ({
    user: {
      host: process.env.USER_GRPC_HOST!,
      port: Number(process.env.USER_GRPC_PORT),
    },

    catalog: {
      host: process.env.CATALOG_GRPC_HOST!,
      port: Number(process.env.CATALOG_GRPC_PORT),
    },

    callTimeoutMs: Number(process.env.GRPC_CALL_TIMEOUT_MS),
    healthTimeoutMs: Number(process.env.GRPC_HEALTH_TIMEOUT_MS),
  }),
);
