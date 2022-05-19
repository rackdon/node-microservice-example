import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import * as http from 'http'
import compression from 'compression'

const app: express.Application = express()
const server = http.createServer(app)

app.use(morgan('common'))
app.use(helmet())
app.use(compression())

server.listen(8080, () => {
  console.log('Server started')
})
