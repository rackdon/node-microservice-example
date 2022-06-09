import { Router } from 'express'
import { graphqlHTTP } from 'express-graphql'
import { UsersGraphController } from '../graphController/users/usersGraphController'

export class GraphRoutes {
  readonly router: Router = Router()

  constructor(usersGraphController: UsersGraphController) {
    this.router.use(
      '/users',
      graphqlHTTP({
        schema: usersGraphController.getUsersSchema(),
        graphiql: true,
      })
    )
  }
}
