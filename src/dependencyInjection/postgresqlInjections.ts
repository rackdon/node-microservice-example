import { loggerConfig, postgresqlConfig } from './configInjections'
import { PostgresqlClient } from '../client/postgresql/postgresqlClient'

const pgClient = await PostgresqlClient.Create(postgresqlConfig, loggerConfig)

export { pgClient }
