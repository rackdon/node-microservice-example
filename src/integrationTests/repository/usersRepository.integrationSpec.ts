/* eslint-disable  @typescript-eslint/no-unused-vars */

import { PostgresqlConfig } from '../../configuration/postgresqlConfig'
import { PostgresqlClient } from '../../client/postgresql/postgresqlClient'
import { LoggerConfig } from '../../configuration/loggerConfig'
import { DatabaseCleanerPsql } from '../utils/databaseCleanerPsql'
import { User } from '../../model/users'
import { Factory } from '../utils/factory'
import { UsersRepository } from '../../repository/usersRepository'
import { generateUser } from '../../tests/utils/generators/usersGenerator'
import { ApiError, Conflict, Internal, NotFound } from '../../model/error'
import { generatePagination } from '../../tests/utils/generators/paginationGenerator'
import { Either } from '../../model/either'
import { expectLeft, expectRight } from '../../tests/utils/expects'
import { randomUUID } from 'crypto'

describe('usersRepository', () => {
  const dbConfig = new PostgresqlConfig({
    DB_HOST: 'localhost',
    DB_PORT: 5432,
    DB_NAME: 'sample_project_test',
    DB_USERNAME: 'owner',
    DB_PASSWORD: 'owner',
    DB_LOG: true,
  })
  const loggerConfig = new LoggerConfig()
  let postgresqlClient: PostgresqlClient
  let dbCleaner
  let factory: Factory
  let usersRepository: UsersRepository
  beforeAll(async () => {
    postgresqlClient = await PostgresqlClient.CreateAsync(
      dbConfig,
      loggerConfig
    )
    dbCleaner = new DatabaseCleanerPsql(postgresqlClient.client)
    factory = new Factory(postgresqlClient.client)
    usersRepository = new UsersRepository(postgresqlClient, loggerConfig)
  })

  beforeEach(async () => {
    await dbCleaner.truncate()
  })

  afterAll(async () => {
    await postgresqlClient.closeConnection()
  })
  it('insertUser inserts the user in the db and returns it', async () => {
    const email = 'mail@mail.com'
    const name = 'name'
    const surname = 'surname'
    const result: Either<ApiError, User> = await usersRepository.insertUser({
      email,
      name,
      surname,
    })
    expectRight(result, (x) => {
      return { email: x.email, name: x.name, surname: x.surname }
    }).toEqual({ email, name, surname })
  })
  it('insertUser returns conflict', async () => {
    const email = 'mail@mail.com'
    const name = 'name'
    const surname = 'surname'
    await factory.insertUser(generateUser(undefined, email, undefined))
    const result = await usersRepository.insertUser({ email, name, surname })
    expectLeft(result).toEqual(new Conflict(['email must be unique']))
  })
  it('getUsers returns all users', async () => {
    const user: User = await factory.insertUser()
    const result = await usersRepository.getUsers({}, generatePagination())
    expectRight(result).toEqual({ data: [user], pages: 1 })
  })

  it('getUsers returns all users that match email query', async () => {
    const _: User = await factory.insertUser()
    const user2: User = await factory.insertUser()
    const result = await usersRepository.getUsers(
      { email: user2.email },
      generatePagination()
    )
    expectRight(result).toEqual({ data: [user2], pages: 1 })
  })

  it('getUserById returns user', async () => {
    const user: User = await factory.insertUser()
    const result = await usersRepository.getUserById(user.id)
    expectRight(result).toEqual(user)
  })

  it('getUserById returns not found', async () => {
    const uuid = randomUUID()
    const result = await usersRepository.getUserById(uuid)
    expectLeft(result).toEqual(new NotFound())
  })

  it('deleteById deletes the user returning 1', async () => {
    const user: User = await factory.insertUser()
    const result = await usersRepository.deleteUserById(user.id)
    expectRight(result).toEqual(1)
  })

  it('deleteById with non existent user returns 0', async () => {
    const uuid = randomUUID()
    const result = await usersRepository.deleteUserById(uuid)
    expectRight(result).toEqual(0)
  })

  it('deleteById manage db error correctly', async () => {
    const result = await usersRepository.deleteUserById('asdf')
    expectLeft(result).toEqual(new Internal())
  })
})
