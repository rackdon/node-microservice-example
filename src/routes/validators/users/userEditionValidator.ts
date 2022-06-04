/* eslint-disable  @typescript-eslint/no-explicit-any */

import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { UserEdition } from '../../../model/users'

export class UserEditionValidator {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  surname!: string

  private constructor(obj: Record<string, any>) {
    Object.assign(this, obj)
  }

  static ValidationInstance(
    obj: Record<string, any>
  ): [UserEditionValidator, UserEditionValidator] {
    const userBaseEdition: UserEdition = { name: '', surname: '' }
    const baseInstance = new UserEditionValidator(userBaseEdition)
    const instance = new UserEditionValidator(obj)
    return [instance, baseInstance]
  }
}
