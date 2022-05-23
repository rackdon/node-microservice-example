/* eslint-disable  @typescript-eslint/no-unused-vars */

import { User, UserCreation } from '../../../model/users'
import { LoggerConfig } from '../../../configuration/loggerConfig'
import { UsersService } from '../../../service/users/usersService'
import { DataWithPages } from '../../../model/pagination'
import { usersRepositoryMock } from '../../mocks/users/usersMocks'
import { UsersRepository } from '../../../repository/usersRepository'
import {
  generateUser,
  generateUserCreation,
} from '../../utils/generators/usersGenerator'

describe('Create user', () => {
  it('returns repository response', async () => {
    const userCreation: UserCreation = generateUserCreation()
    const user: User = generateUser()
    const usersRepository: UsersRepository = usersRepositoryMock({
      insertUser: jest.fn().mockImplementation(() => {
        return [user, null]
      }),
    })
    const loggerConfig = new LoggerConfig()
    const service = new UsersService(usersRepository, loggerConfig)
    const result = await service.createUser(userCreation)

    expect(result).toEqual([user, null])
    expect(usersRepository.insertUser).toBeCalledWith(userCreation)
  })
})

describe('Get users', () => {
  it('returns repository response', async () => {
    const userData: User = generateUser()
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
    expect(usersRepository.getUsers).toBeCalledTimes(1)
  })
})
