import { cleanEnv, num, str, url } from 'envalid'

interface DbClientConfig {
  DB_HOST: string
  DB_PORT: number
  DB_NAME: string
  DB_USERNAME: string
  DB_PASSWORD: string
}
export class PostgresqlConfig {
  readonly host: string
  readonly port: number
  readonly name: string
  readonly username: string
  readonly password: string

  constructor(config?: DbClientConfig) {
    const finalConfig =
      config ||
      cleanEnv(process.env, {
        DB_HOST: str(),
        DB_PORT: num(),
        DB_NAME: str(),
        DB_USERNAME: str(),
        DB_PASSWORD: str(),
      })
    this.host = finalConfig.DB_HOST
    this.port = finalConfig.DB_PORT
    this.name = finalConfig.DB_NAME
    this.username = finalConfig.DB_USERNAME
    this.password = finalConfig.DB_PASSWORD
  }
}
