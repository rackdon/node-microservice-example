# node-microservice-example

## Commands

- npm run build -> Create the build
- npm run start -> Create the build
- npm run local -> Launch the server locally including nodemon watcher
- npm run test -> Run the unit tests
- npm run integration-test -> Run the integration tests
- npm run all-test -> Run all tests
- npm run test:coverage -> Run all tests and calculate coverage

## Env vars

Required env vars before launch the service (if no default value present)

NAME:type(default)

-   SERVER_PORT: number(8080)
-   LOG_LEVEL: {debug, info, warn, error}(warn)
-   SENTRY_DSN: string(''')
-   SENTRY_ENVIRONMENT: string(''')
-   SENTRY_RELEASE: string(''')
