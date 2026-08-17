import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';

import { BaseGrpcCrudClient } from '../base/grpc-crud.client';
import type { GrpcClientsConfig } from '@config/index';

import { UserServiceClient } from '@ecommerce/contracts/generated/ecommerce/user/v1/user';

@Injectable()
export class UserGrpcClient extends BaseGrpcCrudClient<UserServiceClient> {
  constructor(
    @Inject('USER_SERVICE') client: ClientGrpc,
    configService: ConfigService,
  ) {
    const { callTimeoutMs } =
      configService.get<GrpcClientsConfig>('grpcClients')!;

    super(client, 'UserService', 'user-service.UserService', callTimeoutMs);
  }
}
