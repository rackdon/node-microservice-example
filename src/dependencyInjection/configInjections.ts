import { SentryConfig } from '../configuration/sentryConfig'
import { LoggerConfig } from "../configuration/loggerConfig";
import { ServerConfig } from "../configuration/serverConfig";

const sentryConfig = new SentryConfig()
const loggerConfig = new LoggerConfig(null, sentryConfig)
const serverConfig = new ServerConfig()

export {
  serverConfig,
  sentryConfig,
  loggerConfig,
}
