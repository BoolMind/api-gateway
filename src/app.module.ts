import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

import {
  appConfig,
  envValidationSchema,
  grpcClientsConfig,
} from '@config/index';

import { LoggerModule,HealthModule,AppExceptionFilter } from '@common/index';

import { UsersModule ,ProductsModule ,CategoriesModule} from './modules/index';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, grpcClientsConfig],
      envFilePath: '.env',
      validationSchema: envValidationSchema,
    }),

    LoggerModule,
    HealthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
  ],

  providers: [
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
  ],
})
export class AppModule {}

