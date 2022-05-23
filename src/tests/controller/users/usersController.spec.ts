/* eslint-disable  @typescript-eslint/no-unused-vars */

import { LoggerConfig } from '../../../configuration/loggerConfig'
import { User, UserCreation } from '../../../model/users'
import { UsersService } from '../../../service/users/usersService'
import { usersServiceMock } from '../../mocks/users/usersMocks'
import { mockRequest, MockResponse } from '../utils'
import { UsersController } from '../../../controller/users/usersController'
import { BadRequest, Conflict, Internal } from '../../../model/error'
import { DataWithPages } from '../../../model/pagination'
import {
  generateUser,
  generateUserCreation,
} from '../../utils/generators/usersGenerator'

describe('Create user', () => {
  const loggerConfig = new LoggerConfig()
  const userCreation: UserCreation = generateUserCreation()
  it('returns 201 with the user', async () => {
    const createdUser: User = generateUser()
    const usersService: UsersService = usersServiceMock({
      createUser: jest.fn().mockImplementation(() => {
        return [createdUser, null]
      }),
    })
    const mockResponse = new MockResponse()
    const controller = new UsersController(usersService, loggerConfig)

    await controller.createUser(
      mockRequest(null, userCreation, null),
      mockResponse
    )

    expect(mockResponse.statusCode).toEqual(201)
    expect(mockResponse.body).toEqual(createdUser)
    expect(usersService.createUser).toBeCalledWith(userCreation)
  })

  it('returns 409 with errors', async () => {
    const usersService: UsersService = usersServiceMock({
      createUser: jest.fn().mockImplementation(() => {
        return [null, new Conflict(['error'])]
      }),
    })
    const mockResponse = new MockResponse()
    const controller = new UsersController(usersService, loggerConfig)

    await controller.createUser(
      mockRequest(null, userCreation, null),
      mockResponse
    )

    expect(mockResponse.statusCode).toEqual(409)
    expect(mockResponse.body).toEqual({ errors: ['error'] })
    expect(usersService.createUser).toBeCalledTimes(1)
  })
  it('returns 500', async () => {
    const usersService: UsersService = usersServiceMock({
      createUser: jest.fn().mockImplementation(() => {
        return [null, new Internal()]
      }),
    })
    const mockResponse = new MockResponse()
    const controller = new UsersController(usersService, loggerConfig)

    await controller.createUser(
      mockRequest(null, userCreation, null),
      mockResponse
    )

    expect(mockResponse.statusCode).toEqual(500)
    expect(usersService.createUser).toBeCalledWith(userCreation)
  })
})

describe('Get users', () => {
  const loggerConfig = new LoggerConfig()
  const userData: User = generateUser()
  const users: DataWithPages<User> = { data: [userData], pages: 1 }
  it('returns 200 with the users', async () => {
    const usersService: UsersService = usersServiceMock({
      getUsers: jest.fn().mockImplementation(() => {
        return [users, null]
      }),
    })
    const mockResponse = new MockResponse()
    const controller = new UsersController(usersService, loggerConfig)

    await controller.getUsers(mockRequest(null, null, null), mockResponse)

    expect(mockResponse.statusCode).toEqual(200)
    expect(mockResponse.body).toEqual(users)
    expect(usersService.getUsers).toBeCalledTimes(1)
  })

  it('returns 400 with errors', async () => {
    const usersService: UsersService = usersServiceMock({
      getUsers: jest.fn().mockImplementation(() => {
        return [null, new BadRequest(['error'])]
      }),
    })
    const mockResponse = new MockResponse()
    const controller = new UsersController(usersService, loggerConfig)

    await controller.getUsers(mockRequest(null, null, null), mockResponse)

    expect(mockResponse.statusCode).toEqual(400)
    expect(mockResponse.body).toEqual({ errors: ['error'] })
    expect(usersService.getUsers).toBeCalledTimes(1)
  })
  it('returns 500', async () => {
    const usersService: UsersService = usersServiceMock({
      getUsers: jest.fn().mockImplementation(() => {
        return [null, new Internal()]
      }),
    })
    const mockResponse = new MockResponse()
    const controller = new UsersController(usersService, loggerConfig)

    await controller.getUsers(mockRequest(null, null, null), mockResponse)

    expect(mockResponse.statusCode).toEqual(500)
    expect(usersService.getUsers).toBeCalledTimes(1)
  })
})
