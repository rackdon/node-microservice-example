import { LoggerConfig } from "../../configuration/loggerConfig";
import winston from "winston";
import { PostgresqlConfig } from "../../configuration/postgresqlConfig";
import { Pool, PoolClient } from "pg";

export class PostgresqlClient {
  readonly client: Pool
  private transactionClient: PoolClient | undefined
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

    instance.client.connect().then((client) => {
      instance.transactionClient = client
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

    instance.transactionClient = await instance.client.connect()
    instance.closedConnection = false
    instance.logger.info('DB connected')
    return instance
  }

  isClosed(): boolean {
    return this.closedConnection
  }

  getTransactionClient(): PoolClient {
    return this.transactionClient!!
  }

  async closeConnection(): Promise<void> {
    this.transactionClient?.release()
    await this.client.end()
  }
}
