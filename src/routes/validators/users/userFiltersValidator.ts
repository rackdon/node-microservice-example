/* eslint-disable  @typescript-eslint/no-explicit-any */

import { IsNotEmpty, IsOptional } from 'class-validator'
import { PaginationValidator } from '../paginationValidator'
import { PaginatedUsersFilters } from '../../../model/users'

export class UserFilterValidator extends PaginationValidator {
  @IsOptional()
  @IsNotEmpty()
  email!: string

  @IsOptional()
  @IsNotEmpty()
  name!: string

  @IsOptional()
  @IsNotEmpty()
  surname!: string

  private constructor(obj: Record<string, any>) {
    super()
    Object.assign(this, obj)
  }

  static ValidationInstance(
    obj: Record<string, any>
  ): [UserFilterValidator, UserFilterValidator] {
    const baseFilters: PaginatedUsersFilters = {
      email: '',
      name: '',
      surname: '',
      page: 1,
      pageSize: 1,
      sort: '',
      sortDir: 'ASC',
    }
    const baseInstance = new UserFilterValidator(baseFilters)
    const instance = new UserFilterValidator(obj)
    return [instance, baseInstance]
  }
}
