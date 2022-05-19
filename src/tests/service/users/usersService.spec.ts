/* eslint-disable  @typescript-eslint/no-unused-vars */

import { User } from '../../../model/users'
import { LoggerConfig } from '../../../configuration/loggerConfig'
import { UsersService } from '../../../service/users/usersService'
import { DataWithPages } from '../../../model/pagination'
import { usersRepositoryMock } from '../../mocks/users/usersMocks'
import { UsersRepository } from '../../../repository/usersRepository'

describe('Get users', () => {
  it('returns repository response', async () => {
    const userData: User = {
      id: 'id',
      email: 'mail@mail.com',
      createdOn: new Date(),
    }
    const response: DataWithPages<User> = { data: [userData], pages: 1 }
    const usersRepository: UsersRepository = usersRepositoryMock({
      getUsers: jest.fn().mockImplementation(() => {
        return [response, null]
      }),
    })
    const loggerConfig = new LoggerConfig()
    const service = new UsersService(usersRepository, loggerConfig)
    const result = await service.getUsers()

    expect(result).toEqual([response, null])
  })
})
