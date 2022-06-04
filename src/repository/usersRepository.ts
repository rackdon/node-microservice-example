/* eslint-disable  @typescript-eslint/no-explicit-any */

import winston from 'winston'
import { PostgresqlClient } from '../client/postgresql/postgresqlClient'
import { LoggerConfig } from '../configuration/loggerConfig'
import { DataWithPages, Pagination } from '../model/pagination'
import { User, UserCreation, UserEdition, UsersFilters } from '../model/users'
import { Sequelize } from 'sequelize'
import { manageDbErrors } from './errors'
import { getPages, getPaginationQuery } from './pagination'
import { ApiError, NotFound } from '../model/error'
import { Either, EitherI } from '../model/either'

export class UsersRepository {
  readonly logger: winston.Logger
  readonly pgClient: Sequelize

  constructor(pgClient: PostgresqlClient, loggerConfig: LoggerConfig) {
    this.pgClient = pgClient.client
    this.logger = loggerConfig.create(UsersRepository.name)
  }

  async insertUser({
    email,
    name,
    surname,
  }: UserCreation): Promise<Either<ApiError, User>> {
    const result = await EitherI.catchA(async () => {
      const result = await this.pgClient.models.User.create({
        email,
        name,
        surname,
      })
      return result['dataValues']
    })
    return result.mapLeft((e) => {
      return manageDbErrors(e, this.logger)
    })
  }

  async updateUser(
    id: string,
    data: UserEdition
  ): Promise<Either<ApiError, User>> {
    const result = await EitherI.catchA(async () => {
      const [elems, ressultArr] = await this.pgClient.models.User.update(
        { ...data, updatedOn: new Date() },
        {
          where: { id },
          returning: true,
        }
      )
      return elems === 1
        ? ressultArr[0]['dataValues']
        : EitherI.Left(new NotFound())
    })
    return result
      .mapLeft((e) => {
        return manageDbErrors(e, this.logger)
      })
      .bind()
  }

  private getFilters(userFilters: UsersFilters): Record<string, any> {
    const filters = {}
    if (userFilters.email) {
      filters['email'] = userFilters.email
    }
    if (userFilters.name) {
      filters['name'] = userFilters.name
    }
    if (userFilters.surname) {
      filters['surname'] = userFilters.surname
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

  async getUserById(id: string): Promise<Either<ApiError, User>> {
    const result = await EitherI.catchA(async () => {
      const result = await this.pgClient.models.User.findByPk(id)
      return result?.get()
    })
    return result
      .fold(
        (e) => {
          return manageDbErrors(e, this.logger)
        },
        (user) => {
          return user ? result : EitherI.Left(new NotFound())
        }
      )
      .bind()
  }

  async deleteUserById(id: string): Promise<Either<ApiError, number>> {
    const result = await EitherI.catchA(async () => {
      return await this.pgClient.models.User.destroy({ where: { id } })
    })
    return result.mapLeft((e) => {
      return manageDbErrors(e, this.logger)
    })
  }
}
