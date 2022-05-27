/* eslint-disable  @typescript-eslint/no-explicit-any */

import { IsEmail } from 'class-validator'

export class UserCreationValidator {
  @IsEmail()
  email!: string

  private constructor(obj: Record<string, any>) {
    Object.assign(this, obj)
  }

  static ValidationInstance(
    obj: Record<string, any>
  ): [UserCreationValidator, UserCreationValidator] {
    const baseInstance = new UserCreationValidator({ email: '' })
    const instance = new UserCreationValidator(obj)
    return [instance, baseInstance]
  }
}
