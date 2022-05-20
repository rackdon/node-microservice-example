import { PostgresqlConfig } from '../../configuration/postgresqlConfig'
import { PostgresqlClient } from '../../client/postgresql/postgresqlClient'
import { LoggerConfig } from '../../configuration/loggerConfig'
import { DatabaseCleanerPsql } from '../utils/databaseCleanerPsql'

describe('Get users', () => {
  const dbConfig = new PostgresqlConfig({
    DB_HOST: 'localhost',
    DB_PORT: 5432,
    DB_NAME: 'sample_project_test',
    DB_USERNAME: 'owner',
    DB_PASSWORD: 'owner',
  })
  const loggerConfig = new LoggerConfig()
  let postgresqlClient: PostgresqlClient
  let dbCleaner
  beforeAll(async () => {
    postgresqlClient = await PostgresqlClient.CreateAsync(
      dbConfig,
      loggerConfig
    )
    dbCleaner = new DatabaseCleanerPsql(postgresqlClient.client)
  })

  beforeEach(async () => {
    await dbCleaner.truncate()
  })

  afterAll(async () => {
    await postgresqlClient.closeConnection()
  })
  it('Set element correctly', async () => {
    expect(1).toEqual(1)
  })
})
