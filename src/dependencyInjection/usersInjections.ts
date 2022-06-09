import { loggerConfig } from './configInjections'
import { UsersService } from '../service/users/usersService'
import { UsersController } from '../controller/users/usersController'
import { UsersRepository } from '../repository/usersRepository'
import { pgClient } from './postgresqlInjections'
import { UsersGraphController } from "../graphController/users/usersGraphController";

const usersRepository = new UsersRepository(pgClient, loggerConfig)
const usersService = new UsersService(usersRepository, loggerConfig)
const usersController = new UsersController(usersService, loggerConfig)
const usersGraphController = new UsersGraphController(pgClient)

export { usersRepository, usersService, usersController, usersGraphController }
