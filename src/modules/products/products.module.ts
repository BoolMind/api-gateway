import { Module } from '@nestjs/common';

import { GrpcClientsModule } from '@app-grpc/grpc-clients.module';

import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';

@Module({
  imports: [GrpcClientsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
