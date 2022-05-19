import { Router } from 'express'
import { UsersController } from '../controller/users/usersController'

export class Routes {
  readonly router: Router = Router()

  constructor(usersController: UsersController) {
    // USERS

    this.router.get('/users', usersController.getUsers)
  }
}
