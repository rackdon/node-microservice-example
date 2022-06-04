/* eslint-disable  @typescript-eslint/explicit-module-boundary-types */

import winston from 'winston'
import { LoggerConfig } from '../../configuration/loggerConfig'
import { UsersService } from '../../service/users/usersService'
import {
  ApiError,
  BadRequest,
  Conflict,
  Internal,
  NotFound,
} from '../../model/error'
import { User } from '../../model/users'
import { DataWithPages } from '../../model/pagination'

export class UsersController {
  readonly usersService: UsersService
  readonly logger: winston.Logger

  constructor(usersService: UsersService, loggerConfig: LoggerConfig) {
    this.usersService = usersService
    this.logger = loggerConfig.create(UsersController.name)
  }

  createUser = async (req, res): Promise<void> => {
    const result = await this.usersService.createUser(req.body)
    result.fold(
      (error: ApiError) => {
        switch (error.constructor) {
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
      },
      (user: User) => res.status(201).json(user)
    )
  }

  editUser = async (req, res): Promise<void> => {
    const result = await this.usersService.editUser(req.params.id, req.body)
    result.fold(
      (error: ApiError) => {
        switch (error.constructor) {
          case NotFound: {
            res.status(404).send()
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
      },
      (user: User) => res.status(200).json(user)
    )
  }

  getUsers = async (req, res): Promise<void> => {
    const result = await this.usersService.getUsers(req.query)
    result.fold(
      (error: ApiError) => {
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
      },
      (users: DataWithPages<User>) => res.status(200).json(users)
    )
  }

  getUserById = async (req, res): Promise<void> => {
    const result = await this.usersService.getUserById(req.params.id)
    result.fold(
      (error: ApiError) => {
        switch (error?.constructor) {
          case NotFound: {
            res.status(404).send()
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
      },
      (user: User) => res.status(200).json(user)
    )
  }

  deleteUserById = async (req, res): Promise<void> => {
    const result = await this.usersService.deleteUserById(req.params.id)
    result.fold(
      (error: ApiError) => {
        switch (error?.constructor) {
          case Internal: {
            res.status(500).send()
            break
          }
          default: {
            this.logger.warn(`Unexpected error: ${error}`)
            res.status(500).send()
          }
        }
      },
      /* eslint-disable  @typescript-eslint/no-unused-vars */
      (n: number) => res.status(204).send()
    )
  }
}
