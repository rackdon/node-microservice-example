import { UsersService } from '../../../service/users/usersService'
import { UsersRepository } from '../../../repository/usersRepository'

export function usersServiceMock(args: Record<string, unknown>): UsersService {
  return <UsersService>{
    usersRepository: args.usersRepository,
    logger: args.logger,
    createUser: args.createUser,
    editUser: args.editUser,
    getUsers: args.getUsers,
    getUserById: args.getUserById,
    deleteUserById: args.deleteUserById,
  }
}

export function usersRepositoryMock(
  args: Record<string, unknown>
): UsersRepository {
  return <UsersRepository>{
    pgClient: args.pgClient,
    logger: args.logger,
    insertUser: args.insertUser,
    updateUser: args.updateUser,
    getUsers: args.getUsers,
    getUserById: args.getUserById,
    deleteUserById: args.deleteUserById,
  }
}
