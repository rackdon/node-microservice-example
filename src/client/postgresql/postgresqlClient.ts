import { LoggerConfig } from '../../configuration/loggerConfig'
import winston from 'winston'
import { PostgresqlConfig } from '../../configuration/postgresqlConfig'
import { Sequelize } from 'sequelize'

export class PostgresqlClient {
  readonly client: Sequelize
  readonly logger: winston.Logger
  private closedConnection = true

  private constructor(config: PostgresqlConfig, loggerConfig: LoggerConfig) {
    this.client = new Sequelize({
      dialect: 'postgres',
      host: config.host,
      port: config.port,
      database: config.name,
      username: config.username,
      password: config.password,
    })
    this.logger = loggerConfig.create(PostgresqlClient.name)
  }
  static Create(
    config: PostgresqlConfig,
    loggerConfig: LoggerConfig
  ): PostgresqlClient {
    const instance = new PostgresqlClient(config, loggerConfig)

    instance.client.validate().then(() => {
      instance.closedConnection = false
      instance.logger.info('DB connected')
    })
    return instance
  }

  static async CreateAsync(
    config: PostgresqlConfig,
    loggerConfig: LoggerConfig
  ): Promise<PostgresqlClient> {
    const instance = new PostgresqlClient(config, loggerConfig)

    instance.closedConnection = false
    await instance.client.validate()
    instance.logger.info('DB connected')
    return instance
  }

  isClosed(): boolean {
    return this.closedConnection
  }

  async closeConnection(): Promise<void> {
    await this.client.close()
    this.logger.info('DB disconnected')
  }
}
