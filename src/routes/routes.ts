import { Router } from 'express'
import { UsersController } from '../controller/users/usersController'
import { validateBody } from './validators/validator'
import { UserCreationValidator } from './validators/users/userCreationValidator'

export class Routes {
  readonly router: Router = Router()

  constructor(usersController: UsersController) {
    // USERS

    this.router.post(
      '/users',
      validateBody(UserCreationValidator.ValidationInstance),
      usersController.createUser
    )
    this.router.get('/users', usersController.getUsers)
  }
}
