import winston from 'winston'
import { LoggerConfig } from '../../configuration/loggerConfig'
import { ApiResponse } from '../../model/apiResponse'
import {
  PaginatedUsersFilters,
  toUsersFilters,
  User,
  UserCreation,
} from '../../model/users'
import { DataWithPages, toPagination } from '../../model/pagination'
import { UsersRepository } from '../../repository/usersRepository'

export class UsersService {
  readonly logger: winston.Logger
  readonly usersRepository: UsersRepository

  constructor(usersRepository: UsersRepository, loggerConfig: LoggerConfig) {
    this.logger = loggerConfig.create(UsersService.name)
    this.usersRepository = usersRepository
  }

  async createUser(userCreation: UserCreation): Promise<ApiResponse<User>> {
    return this.usersRepository.insertUser(userCreation)
  }

  async getUsers(
    filters: PaginatedUsersFilters
  ): Promise<ApiResponse<DataWithPages<User>>> {
    const userFilters = toUsersFilters(filters)
    const paginationFilters = toPagination(filters)
    return this.usersRepository.getUsers(userFilters, paginationFilters)
  }
}
