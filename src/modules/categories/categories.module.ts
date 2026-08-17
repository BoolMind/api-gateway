import { Module } from '@nestjs/common';

import { GrpcClientsModule } from '@app-grpc/grpc-clients.module';

import { CategoriesController } from './controllers/categories.controller';
import { CategoriesService } from './services/categories.service';

@Module({
  imports: [GrpcClientsModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
