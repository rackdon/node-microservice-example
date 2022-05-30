/* eslint-disable  @typescript-eslint/no-explicit-any */

import { IsNotEmpty, IsOptional } from 'class-validator'
import { PaginationValidator } from '../paginationValidator'

export class UserFilterValidator extends PaginationValidator {
  @IsOptional()
  @IsNotEmpty()
  email!: string

  private constructor(obj: Record<string, any>) {
    super()
    Object.assign(this, obj)
  }

  static ValidationInstance(
    obj: Record<string, any>
  ): [UserFilterValidator, UserFilterValidator] {
    const baseInstance = new UserFilterValidator({
      email: '',
      page: 1,
      pageSize: 1,
      sort: '',
      sortDir: '',
    })
    const instance = new UserFilterValidator(obj)
    return [instance, baseInstance]
  }
}
