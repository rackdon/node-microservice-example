import { Routes } from '../routes/routes'
import { usersController } from './usersInjections'

const routes = new Routes(usersController)
export { routes }
