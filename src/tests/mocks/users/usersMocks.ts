import { UsersService } from '../../../service/users/usersService'

export function usersServiceMock(args: Record<string, unknown>): UsersService {
  return <UsersService>{
    logger: args.logger,
    getUsers: args.getUsers,
  }
}
