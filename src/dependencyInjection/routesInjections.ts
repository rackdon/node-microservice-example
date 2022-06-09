import { Routes } from '../routes/routes'
import { usersController, usersGraphController } from './usersInjections'
import { GraphRoutes } from '../routes/graphRoutes'

const routes = new Routes(usersController)
const graphRoutes = new GraphRoutes(usersGraphController)
export { routes, graphRoutes }
