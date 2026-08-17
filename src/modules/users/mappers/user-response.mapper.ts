import { grpcTimestampToIso } from '@common/utils';

// NOTE: verify this import once `npm run proto:generate` has been run.
import { User as UserGrpc } from '@ecommerce/contracts/generated/ecommerce/user/v1/user';

import { UserResponseDto } from '../dto/user-response.dto';

export function toUserResponse(user: UserGrpc): UserResponseDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: grpcTimestampToIso(user.createdAt),
    updatedAt: grpcTimestampToIso(user.updatedAt),
  };
}
