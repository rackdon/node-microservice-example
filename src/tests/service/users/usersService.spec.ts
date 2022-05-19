/* eslint-disable  @typescript-eslint/no-unused-vars */

import { User } from '../../../model/users'
import { LoggerConfig } from '../../../configuration/loggerConfig'
import { UsersService } from '../../../service/users/usersService'
import { DataWithPages } from '../../../model/pagination'

describe('Get users', () => {
  it('returns success response', async () => {
    const userData: User = {
      id: 'id',
      email: 'mail@mail.com',
    }
    const response: DataWithPages<User> = { data: [userData], pages: 1 }
    const loggerConfig = new LoggerConfig()
    const service = new UsersService(loggerConfig)
    const result = await service.getUsers()

    expect(result).toEqual([response, null])
  })
})
