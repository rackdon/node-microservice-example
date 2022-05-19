import { LoggerConfig } from '../../configuration/loggerConfig'
import winston from 'winston'
import { PostgresqlConfig } from '../../configuration/postgresqlConfig'
import { Pool } from 'pg'

export class PostgresqlClient {
  readonly client: Pool
  readonly logger: winston.Logger
  private closedConnection = true

  private constructor(config: PostgresqlConfig, loggerConfig: LoggerConfig) {
    this.client = new Pool({
      host: config.host,
      port: config.port,
      database: config.name,
      user: config.username,
      password: config.password,
    })
    this.logger = loggerConfig.create(PostgresqlClient.name)
  }
  static Create(
    config: PostgresqlConfig,
    loggerConfig: LoggerConfig
  ): PostgresqlClient {
    const instance = new PostgresqlClient(config, loggerConfig)

    instance.client.connect().then(() => {
      instance.closedConnection = false
      instance.logger.info('DB connected')
    })
    return instance
  }

  isClosed(): boolean {
    return this.closedConnection
  }
}
