import { Module } from '@nestjs/common';

import { GrpcClientsModule } from '@app-grpc/grpc-clients.module';

import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

@Module({
  imports: [GrpcClientsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
