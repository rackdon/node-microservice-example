/* eslint-disable  @typescript-eslint/no-unused-vars */

import {
  User,
  UserCreation,
  UserEdition,
  UsersFilters,
} from '../../../model/users'
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
import { randomUUID } from 'crypto'

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

describe('Edit user', () => {
  it('return repository response', async () => {
    const userEdition: UserEdition = { name: 'name' }
    const user: User = generateUser()
    const usersRepository: UsersRepository = usersRepositoryMock({
      updateUser: jest.fn().mockImplementation(() => {
        return EitherI.Right(user)
      }),
    })
    const loggerConfig = new LoggerConfig()
    const service = new UsersService(usersRepository, loggerConfig)
    const result = await service.editUser(user.id, userEdition)

    expectRight(result).toEqual(user)
    expect(usersRepository.updateUser).toBeCalledWith(user.id, userEdition)
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

describe('Get user by id', () => {
  it('returns repository response', async () => {
    const userData: User = generateUser()
    const usersRepository: UsersRepository = usersRepositoryMock({
      getUserById: jest.fn().mockImplementation(() => {
        return EitherI.Right(userData)
      }),
    })
    const loggerConfig = new LoggerConfig()
    const service = new UsersService(usersRepository, loggerConfig)
    const result = await service.getUserById(userData.id)

    expectRight(result).toEqual(userData)
    expect(usersRepository.getUserById).toBeCalledWith(userData.id)
  })
})

describe('Delete user by id', () => {
  it('returns repository response', async () => {
    const userId = randomUUID()
    const usersRepository: UsersRepository = usersRepositoryMock({
      deleteUserById: jest.fn().mockImplementation(() => {
        return EitherI.Right(1)
      }),
    })
    const loggerConfig = new LoggerConfig()
    const service = new UsersService(usersRepository, loggerConfig)
    const result = await service.deleteUserById(userId)

    expectRight(result).toEqual(1)
    expect(usersRepository.deleteUserById).toBeCalledWith(userId)
  })
})
