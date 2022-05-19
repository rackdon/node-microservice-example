import { loggerConfig } from './configInjections'
import { UsersService } from '../service/users/usersService'
import { UsersController } from '../controller/users/usersController'

const usersService = new UsersService(loggerConfig)
const usersController = new UsersController(usersService, loggerConfig)

export { usersService, usersController }
