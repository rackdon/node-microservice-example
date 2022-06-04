/* eslint-disable  @typescript-eslint/no-explicit-any */

import winston from 'winston'
import { PostgresqlClient } from '../client/postgresql/postgresqlClient'
import { LoggerConfig } from '../configuration/loggerConfig'
import { DataWithPages, Pagination } from '../model/pagination'
import { User, UserCreation, UsersFilters } from '../model/users'
import { Sequelize } from 'sequelize'
import { manageDbErrors } from './errors'
import { getPages, getPaginationQuery } from './pagination'
import { ApiError } from '../model/error'
import { Either, EitherI } from '../model/either'

export class UsersRepository {
  readonly logger: winston.Logger
  readonly pgClient: Sequelize

  constructor(pgClient: PostgresqlClient, loggerConfig: LoggerConfig) {
    this.pgClient = pgClient.client
    this.logger = loggerConfig.create(UsersRepository.name)
  }

  async insertUser({ email }: UserCreation): Promise<Either<ApiError, User>> {
    const result = await EitherI.catchA(async () => {
      const result = await this.pgClient.models.User.create({ email })
      return result['dataValues']
    })
    return result.mapLeft((e) => {
      return manageDbErrors(e, this.logger)
    })
  }

  private getFilters(userFilters: UsersFilters): Record<string, any> {
    const filters = {}
    if (userFilters.email) {
      filters['email'] = userFilters.email
    }
    return filters
  }

  async getUsers(
    filters: UsersFilters,
    pagination: Pagination
  ): Promise<Either<ApiError, DataWithPages<User>>> {
    const paginationQuery = getPaginationQuery(pagination)
    const userFilters = this.getFilters(filters)
    const query = { ...paginationQuery, where: userFilters }
    const result = await EitherI.catchA(async () => {
      const users = await this.pgClient.models.User.findAndCountAll(query)
      return {
        data: users.rows.map((x) => x.get()),
        pages: getPages(users.count, pagination.pageSize),
      }
    })
    return result.mapLeft((e) => {
      return manageDbErrors(e, this.logger)
    })
  }
}
