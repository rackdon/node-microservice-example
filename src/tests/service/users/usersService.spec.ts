/* eslint-disable  @typescript-eslint/no-unused-vars */

import { User, UserCreation, UsersFilters } from '../../../model/users'
import { LoggerConfig } from '../../../configuration/loggerConfig'
import { UsersService } from '../../../service/users/usersService'
import { DataWithPages, Pagination } from '../../../model/pagination'
import { usersRepositoryMock } from '../../mocks/users/usersMocks'
import { UsersRepository } from '../../../repository/usersRepository'
import {
  generateUser,
  generateUserCreation,
} from '../../utils/generators/usersGenerator'
import { EitherI } from '../../../model/either'
import { expectRight } from '../../utils/expects'

describe('Create user', () => {
  it('returns repository response', async () => {
    const userCreation: UserCreation = generateUserCreation()
    const user: User = generateUser()
    const usersRepository: UsersRepository = usersRepositoryMock({
      insertUser: jest.fn().mockImplementation(() => {
        return EitherI.Right(user)
      }),
    })
    const loggerConfig = new LoggerConfig()
    const service = new UsersService(usersRepository, loggerConfig)
    const result = await service.createUser(userCreation)

    expectRight(result).toEqual(user)
    expect(usersRepository.insertUser).toBeCalledWith(userCreation)
  })
})

describe('Get users', () => {
  it('returns repository response', async () => {
    const userData: User = generateUser()
    const response: DataWithPages<User> = { data: [userData], pages: 1 }
    const filters = { email: 'email', pageSize: 5 }
    const userFilters: UsersFilters = { email: filters.email }
    const paginationFilters: Pagination = {
      pageSize: filters.pageSize,
      page: 0,
      sort: [],
      sortDir: null,
    }
    const usersRepository: UsersRepository = usersRepositoryMock({
      getUsers: jest.fn().mockImplementation(() => {
        return EitherI.Right(response)
      }),
    })
    const loggerConfig = new LoggerConfig()
    const service = new UsersService(usersRepository, loggerConfig)
    const result = await service.getUsers(filters)

    expectRight(result).toEqual(response)
    expect(usersRepository.getUsers).toBeCalledWith(
      userFilters,
      paginationFilters
    )
  })
})
