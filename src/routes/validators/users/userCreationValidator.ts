/* eslint-disable  @typescript-eslint/no-explicit-any */

import { IsEmail, IsNotEmpty } from 'class-validator'
import { UserCreation } from '../../../model/users'

export class UserCreationValidator {
  @IsEmail()
  email!: string

  @IsNotEmpty()
  name!: string
  @IsNotEmpty()
  surname!: string

  private constructor(obj: Record<string, any>) {
    Object.assign(this, obj)
  }

  static ValidationInstance(
    obj: Record<string, any>
  ): [UserCreationValidator, UserCreationValidator] {
    const userBaseCreation: UserCreation = { email: '', name: '', surname: '' }
    const baseInstance = new UserCreationValidator(userBaseCreation)
    const instance = new UserCreationValidator(obj)
    return [instance, baseInstance]
  }
}
