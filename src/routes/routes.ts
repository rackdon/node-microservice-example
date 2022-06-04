import { Router } from 'express'
import { UsersController } from '../controller/users/usersController'
import { validateBody, validateQueryParams } from './validators/validator'
import { UserCreationValidator } from './validators/users/userCreationValidator'
import { UserFilterValidator } from './validators/users/userFiltersValidator'
import { UserEditionValidator } from './validators/users/userEditionValidator'

export class Routes {
  readonly router: Router = Router()

  constructor(usersController: UsersController) {
    // USERS

    this.router.post(
      '/users',
      validateBody(UserCreationValidator.ValidationInstance),
      usersController.createUser
    )
    this.router.patch(
      '/users/:id',
      validateBody(UserEditionValidator.ValidationInstance),
      usersController.editUser
    )
    this.router.get(
      '/users',
      validateQueryParams(UserFilterValidator.ValidationInstance),
      usersController.getUsers
    )
    this.router.get('/users/:id', usersController.getUserById)
    this.router.delete('/users/:id', usersController.deleteUserById)
  }
}
