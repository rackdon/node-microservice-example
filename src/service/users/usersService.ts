import winston from 'winston'
import { LoggerConfig } from '../../configuration/loggerConfig'
import {
  PaginatedUsersFilters,
  toUsersFilters,
  User,
  UserCreation,
  UserEdition,
} from '../../model/users'
import { DataWithPages, toPagination } from '../../model/pagination'
import { UsersRepository } from '../../repository/usersRepository'
import { Either } from '../../model/either'
import { ApiError } from '../../model/error'

export class UsersService {
  readonly logger: winston.Logger
  readonly usersRepository: UsersRepository

  constructor(usersRepository: UsersRepository, loggerConfig: LoggerConfig) {
    this.logger = loggerConfig.create(UsersService.name)
    this.usersRepository = usersRepository
  }

  async createUser(
    userCreation: UserCreation
  ): Promise<Either<ApiError, User>> {
    return this.usersRepository.insertUser(userCreation)
  }

  async editUser(
    userId: string,
    userEdition: UserEdition
  ): Promise<Either<ApiError, User>> {
    return this.usersRepository.updateUser(userId, userEdition)
  }

  async getUsers(
    filters: PaginatedUsersFilters
  ): Promise<Either<ApiError, DataWithPages<User>>> {
    const userFilters = toUsersFilters(filters)
    const paginationFilters = toPagination(filters)
    return this.usersRepository.getUsers(userFilters, paginationFilters)
  }

  async getUserById(id: string): Promise<Either<ApiError, User>> {
    return this.usersRepository.getUserById(id)
  }

  async deleteUserById(id: string): Promise<Either<ApiError, number>> {
    return this.usersRepository.deleteUserById(id)
  }
}
