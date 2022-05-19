import winston from 'winston'
import { PostgresqlClient } from '../client/postgresql/postgresqlClient'
import { LoggerConfig } from '../configuration/loggerConfig'
import { ApiResponse } from '../model/apiResponse'
import { DataWithPages } from '../model/pagination'
import { User } from '../model/users'
import { Pool } from 'pg'

export class UsersRepository {
  readonly logger: winston.Logger
  readonly pgClient: Pool

  constructor(pgClient: PostgresqlClient, loggerConfig: LoggerConfig) {
    this.pgClient = pgClient.client
    this.logger = loggerConfig.create(UsersRepository.name)
  }

  async getUsers(): Promise<ApiResponse<DataWithPages<User>>> {
    const foo = await this.pgClient.query('SELECT * from users')
    const user = { id: 'id', email: 'mail@mail.com', createdOn: new Date() }
    return [{ data: [user], pages: 1 }, null]
  }
}
