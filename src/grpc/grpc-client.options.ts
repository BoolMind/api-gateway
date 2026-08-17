import { Transport } from '@nestjs/microservices';
import { resolve } from 'path';

const contractsPath = require
  .resolve('@ecommerce/contracts/package.json')
  .replace('/package.json', '');

const protoIncludeDirs = [
  resolve(contractsPath, 'proto'),
  resolve(contractsPath, 'dependencies'),
];

const healthProtoPath = resolve(
  contractsPath,
  'proto/ecommerce/common/v1/health.proto',
);

export function createGrpcClientOptions(
  servicePackage: string,
  serviceProtoPath: string,
  endpoint: {
    host: string;
    port: number;
  },
) {
  return {
    transport: Transport.GRPC as const,

    options: {
      package: [servicePackage, 'ecommerce.common.v1'],

      protoPath: [serviceProtoPath, healthProtoPath],

      loader: {
        includeDirs: protoIncludeDirs,
      },

      url: `${endpoint.host}:${endpoint.port}`,
    },
  };
}

export const USER_PROTO_PATH = resolve(
  contractsPath,
  'proto/ecommerce/user/v1/user.proto',
);

export const CATALOG_PROTO_PATH = resolve(
  contractsPath,
  'proto/ecommerce/catalog/v1/catalog.proto',
);
