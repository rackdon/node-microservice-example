import { PostgresqlConfig } from '../../configuration/postgresqlConfig'
import { PostgresqlClient } from '../../client/postgresql/postgresqlClient'
import { LoggerConfig } from '../../configuration/loggerConfig'
import { DatabaseCleanerPsql } from '../utils/databaseCleanerPsql'
import { User } from '../../model/users'
import { Factory } from '../utils/factory'
import { UsersRepository } from '../../repository/usersRepository'

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
  let factory
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
  it('getUsers', async () => {
    const user: User = await factory.insertUser()
    const result = await usersRepository.getUsers()
    expect(result).toEqual([{ data: [user], pages: 1 }, null])
  })
})
