import { LoggerConfig } from '../../configuration/loggerConfig'
import winston from 'winston'
import { PostgresqlConfig } from '../../configuration/postgresqlConfig'
import { Client } from 'ts-postgres'

export class PostgresqlClient {
  readonly client: Client
  readonly logger: winston.Logger
  private constructor(config: PostgresqlConfig, loggerConfig: LoggerConfig) {
    this.client = new Client({
      host: config.host,
      port: config.port,
      database: config.name,
      user: config.username,
      password: config.password,
    })
    this.logger = loggerConfig.create(PostgresqlClient.name)
  }
  static async Create(
    config: PostgresqlConfig,
    loggerConfig: LoggerConfig
  ): Promise<PostgresqlClient> {
    const instance = new PostgresqlClient(config, loggerConfig)

    await instance.client.connect()
    return instance
  }

  isClosed(): boolean {
    return this.client.closed
  }
}
