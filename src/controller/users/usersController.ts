/* eslint-disable  @typescript-eslint/explicit-module-boundary-types */

import winston from 'winston'
import { LoggerConfig } from '../../configuration/loggerConfig'
import { UsersService } from '../../service/users/usersService'
import { BadRequest, Conflict, Internal } from '../../model/error'

export class UsersController {
  readonly usersService: UsersService
  readonly logger: winston.Logger

  constructor(usersService: UsersService, loggerConfig: LoggerConfig) {
    this.usersService = usersService
    this.logger = loggerConfig.create(UsersController.name)
  }

  createUser = async (req, res): Promise<void> => {
    const [user, error] = await this.usersService.createUser(req.body)
    if (user) {
      res.status(201).json(user)
    } else {
      switch (error?.constructor) {
        case Conflict: {
          res.status(409).json(error)
          break
        }
        case Internal: {
          res.status(500).send()
          break
        }
        default: {
          this.logger.warn(`Unexpected error: ${error}`)
          res.status(500).send()
        }
      }
    }
  }

  getUsers = async (req, res): Promise<void> => {
    const [users, error] = await this.usersService.getUsers()
    if (users) {
      res.status(200).json(users)
    } else {
      switch (error?.constructor) {
        case BadRequest: {
          res.status(400).json(error)
          break
        }
        case Internal: {
          res.status(500).send()
          break
        }
        default: {
          this.logger.warn(`Unexpected error: ${error}`)
          res.status(500).send()
        }
      }
    }
  }
}
