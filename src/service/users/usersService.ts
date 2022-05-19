import winston from 'winston'
import { LoggerConfig } from '../../configuration/loggerConfig'
import { ApiResponse } from '../../model/apiResponse'
import { User } from '../../model/users'
import { DataWithPages } from '../../model/pagination'
import { UsersRepository } from '../../repository/usersRepository'

export class UsersService {
  readonly logger: winston.Logger
  readonly usersRepository: UsersRepository

  constructor(usersRepository: UsersRepository, loggerConfig: LoggerConfig) {
    this.logger = loggerConfig.create(UsersService.name)
    this.usersRepository = usersRepository
  }

  async getUsers(): Promise<ApiResponse<DataWithPages<User>>> {
    return this.usersRepository.getUsers()
  }
}
