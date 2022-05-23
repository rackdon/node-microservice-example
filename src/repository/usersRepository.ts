import winston from 'winston'
import { PostgresqlClient } from '../client/postgresql/postgresqlClient'
import { LoggerConfig } from '../configuration/loggerConfig'
import { ApiResponse } from '../model/apiResponse'
import { DataWithPages } from '../model/pagination'
import { User, UserCreation } from '../model/users'
import { Sequelize } from 'sequelize'
import { manageDbErrors } from './errors'

export class UsersRepository {
  readonly logger: winston.Logger
  readonly pgClient: Sequelize

  constructor(pgClient: PostgresqlClient, loggerConfig: LoggerConfig) {
    this.pgClient = pgClient.client
    this.logger = loggerConfig.create(UsersRepository.name)
  }

  async insertUser({ email }: UserCreation): Promise<ApiResponse<User>> {
    try {
      const result = await this.pgClient.models.User.create({ email })
      return [result['dataValues'], null]
    } catch (e) {
      return [null, manageDbErrors(e, this.logger)]
    }
  }

  async getUsers(): Promise<ApiResponse<DataWithPages<User>>> {
    const users = await this.pgClient.models.User.findAndCountAll({ limit: 1 })
    return [{ data: users.rows.map((x) => x.get()), pages: 1 }, null]
  }
}
