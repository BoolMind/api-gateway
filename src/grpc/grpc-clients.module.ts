import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';

import type { GrpcClientsConfig } from '@config/index';

import {
  CATALOG_PROTO_PATH,
  createGrpcClientOptions,
  USER_PROTO_PATH,
} from './grpc-client.options';

import { CategoryGrpcClient } from './clients/category.grpc-client';
import { HealthGrpcClient } from './clients/health.grpc-client';
import { ProductGrpcClient } from './clients/product.grpc-client';
import { UserGrpcClient } from './clients/user.grpc-client';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const config =
            configService.get<GrpcClientsConfig>('grpcClients')!;

          return createGrpcClientOptions(
            'ecommerce.user.v1',
            USER_PROTO_PATH,
            config.user,
          );
        },
      },
      {
        name: 'CATALOG_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const config =
            configService.get<GrpcClientsConfig>('grpcClients')!;

          return createGrpcClientOptions(
            'ecommerce.catalog.v1',
            CATALOG_PROTO_PATH,
            config.catalog,
          );
        },
      },
    ]),
  ],
  providers: [
    UserGrpcClient,
    ProductGrpcClient,
    CategoryGrpcClient,
    HealthGrpcClient,
  ],
  exports: [
    UserGrpcClient,
    ProductGrpcClient,
    CategoryGrpcClient,
    HealthGrpcClient,
  ],
})
export class GrpcClientsModule {}