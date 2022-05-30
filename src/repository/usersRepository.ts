/* eslint-disable  @typescript-eslint/no-explicit-any */

import winston from 'winston'
import { PostgresqlClient } from '../client/postgresql/postgresqlClient'
import { LoggerConfig } from '../configuration/loggerConfig'
import { ApiResponse } from '../model/apiResponse'
import { DataWithPages, Pagination } from '../model/pagination'
import { User, UserCreation, UsersFilters } from '../model/users'
import { Sequelize } from 'sequelize'
import { manageDbErrors } from './errors'
import { getPages, getPaginationQuery } from './pagination'

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
  ): Promise<ApiResponse<DataWithPages<User>>> {
    const paginationQuery = getPaginationQuery(pagination)
    const userFilters = this.getFilters(filters)
    const query = { ...paginationQuery, where: userFilters }
    const users = await this.pgClient.models.User.findAndCountAll(query)
    const usersData = {
      data: users.rows.map((x) => x.get()),
      pages: getPages(users.count, pagination.pageSize),
    }
    return [usersData, null]
  }
}
