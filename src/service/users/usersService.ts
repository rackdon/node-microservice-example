import winston from 'winston'
import { LoggerConfig } from '../../configuration/loggerConfig'
import { ApiResponse } from '../../model/apiResponse'
import { User } from '../../model/users'
import { DataWithPages } from '../../model/pagination'

export class UsersService {
  readonly logger: winston.Logger

  constructor(loggerConfig: LoggerConfig) {
    this.logger = loggerConfig.create(UsersService.name)
  }

  async getUsers(): Promise<ApiResponse<DataWithPages<User>>> {
    const user = { id: 'id', email: 'mail@mail.com' }
    return [{ data: [user], pages: 1 }, null]
  }
}
