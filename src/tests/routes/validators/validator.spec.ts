/* eslint-disable  @typescript-eslint/no-explicit-any */

import { IsEmail } from 'class-validator'
import { getValidationErrors } from '../../../routes/validators/validator'

class ValidationTestClass {
  @IsEmail()
  email!: string

  constructor(obj: Record<string, any>) {
    Object.assign(this, obj)
  }
}

describe('getValidationErrors', () => {
  it('returns all validation errors', async () => {
    const instance = new ValidationTestClass({ email: 'a', unexpected: 'b' })
    const baseInstance = new ValidationTestClass({ email: 'mail@mail.com' })
    const validationErrors = await getValidationErrors(instance, baseInstance)

    expect(validationErrors).toEqual([
      'unexpected is an invalid key',
      'email must be an email',
    ])
  })
})
