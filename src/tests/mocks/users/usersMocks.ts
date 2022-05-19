import { UsersService } from '../../../service/users/usersService'
import { UsersRepository } from '../../../repository/usersRepository'

export function usersServiceMock(args: Record<string, unknown>): UsersService {
  return <UsersService>{
    usersRepository: args.usersRepository,
    logger: args.logger,
    getUsers: args.getUsers,
  }
}

export function usersRepositoryMock(
  args: Record<string, unknown>
): UsersRepository {
  return <UsersRepository>{
    pgClient: args.pgClient,
    logger: args.logger,
    getUsers: args.getUsers,
  }
}
