/* eslint-disable  @typescript-eslint/no-unused-vars */

import { LoggerConfig } from '../../../configuration/loggerConfig'
import { User, UserCreation, UserEdition } from '../../../model/users'
import { UsersService } from '../../../service/users/usersService'
import { usersServiceMock } from '../../mocks/users/usersMocks'
import { mockRequest, MockResponse } from '../utils'
import { UsersController } from '../../../controller/users/usersController'
import { BadRequest, Conflict, Internal, NotFound } from '../../../model/error'
import { DataWithPages } from '../../../model/pagination'
import {
  generateUser,
  generateUserCreation,
} from '../../utils/generators/usersGenerator'
import { EitherI } from '../../../model/either'
import { randomUUID } from 'crypto'

describe('Create user', () => {
  const loggerConfig = new LoggerConfig()
  const userCreation: UserCreation = generateUserCreation()
  it('returns 201 with the user', async () => {
    const createdUser: User = generateUser()
    const usersService: UsersService = usersServiceMock({
      createUser: jest.fn().mockImplementation(() => {
        return EitherI.Right(createdUser)
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
        return EitherI.Left(new Conflict(['error']))
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
        return EitherI.Left(new Internal())
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

describe('Edit user', () => {
  const loggerConfig = new LoggerConfig()
  const userEdition: UserEdition = { name: 'name' }
  const user: User = generateUser()
  it('returns 200 with the user', async () => {
    const usersService: UsersService = usersServiceMock({
      editUser: jest.fn().mockImplementation(() => {
        return EitherI.Right(user)
      }),
    })
    const mockResponse = new MockResponse()
    const controller = new UsersController(usersService, loggerConfig)

    await controller.editUser(
      mockRequest({ id: user.id }, userEdition, null),
      mockResponse
    )

    expect(mockResponse.statusCode).toEqual(200)
    expect(mockResponse.body).toEqual(user)
    expect(usersService.editUser).toBeCalledWith(user.id, userEdition)
  })

  it('returns 404', async () => {
    const usersService: UsersService = usersServiceMock({
      editUser: jest.fn().mockImplementation(() => {
        return EitherI.Left(new NotFound())
      }),
    })
    const mockResponse = new MockResponse()
    const controller = new UsersController(usersService, loggerConfig)

    await controller.editUser(
      mockRequest({ id: user.id }, userEdition, null),
      mockResponse
    )

    expect(mockResponse.statusCode).toEqual(404)
    expect(usersService.editUser).toBeCalledWith(user.id, userEdition)
  })
  it('returns 500', async () => {
    const usersService: UsersService = usersServiceMock({
      editUser: jest.fn().mockImplementation(() => {
        return EitherI.Left(new Internal())
      }),
    })
    const mockResponse = new MockResponse()
    const controller = new UsersController(usersService, loggerConfig)

    await controller.editUser(
      mockRequest({ id: user.id }, userEdition, null),
      mockResponse
    )

    expect(mockResponse.statusCode).toEqual(500)
    expect(usersService.editUser).toBeCalledWith(user.id, userEdition)
  })
})

describe('Get users', () => {
  const loggerConfig = new LoggerConfig()
  const userData: User = generateUser()
  const users: DataWithPages<User> = { data: [userData], pages: 1 }
  const query = { pageSize: 5 }
  it('returns 200 with the users', async () => {
    const usersService: UsersService = usersServiceMock({
      getUsers: jest.fn().mockImplementation(() => {
        return EitherI.Right(users)
      }),
    })
    const mockResponse = new MockResponse()
    const controller = new UsersController(usersService, loggerConfig)

    await controller.getUsers(mockRequest(null, null, query), mockResponse)

    expect(mockResponse.statusCode).toEqual(200)
    expect(mockResponse.body).toEqual(users)
    expect(usersService.getUsers).toBeCalledWith(query)
  })

  it('returns 400 with errors', async () => {
    const usersService: UsersService = usersServiceMock({
      getUsers: jest.fn().mockImplementation(() => {
        return EitherI.Left(new BadRequest(['error']))
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
        return EitherI.Left(new Internal())
      }),
    })
    const mockResponse = new MockResponse()
    const controller = new UsersController(usersService, loggerConfig)

    await controller.getUsers(mockRequest(null, null, null), mockResponse)

    expect(mockResponse.statusCode).toEqual(500)
    expect(usersService.getUsers).toBeCalledTimes(1)
  })
})

describe('Get user by id', () => {
  const loggerConfig = new LoggerConfig()
  const userData: User = generateUser()
  it('returns 200 with the users', async () => {
    const usersService: UsersService = usersServiceMock({
      getUserById: jest.fn().mockImplementation(() => {
        return EitherI.Right(userData)
      }),
    })
    const mockResponse = new MockResponse()
    const controller = new UsersController(usersService, loggerConfig)

    await controller.getUserById(
      mockRequest({ id: userData.id }, null, null),
      mockResponse
    )

    expect(mockResponse.statusCode).toEqual(200)
    expect(mockResponse.body).toEqual(userData)
    expect(usersService.getUserById).toBeCalledWith(userData.id)
  })

  it('returns 404', async () => {
    const usersService: UsersService = usersServiceMock({
      getUserById: jest.fn().mockImplementation(() => {
        return EitherI.Left(new NotFound())
      }),
    })
    const mockResponse = new MockResponse()
    const controller = new UsersController(usersService, loggerConfig)

    await controller.getUserById(
      mockRequest({ id: userData.id }, null, null),
      mockResponse
    )

    expect(mockResponse.statusCode).toEqual(404)
    expect(usersService.getUserById).toBeCalledWith(userData.id)
  })
  it('returns 500', async () => {
    const usersService: UsersService = usersServiceMock({
      getUserById: jest.fn().mockImplementation(() => {
        return EitherI.Left(new Internal())
      }),
    })
    const mockResponse = new MockResponse()
    const controller = new UsersController(usersService, loggerConfig)

    await controller.getUserById(
      mockRequest({ id: userData.id }, null, null),
      mockResponse
    )

    expect(mockResponse.statusCode).toEqual(500)
    expect(usersService.getUserById).toBeCalledWith(userData.id)
  })
})

describe('Delete user by id', () => {
  const loggerConfig = new LoggerConfig()
  const userId = randomUUID()
  it('returns 204', async () => {
    const usersService: UsersService = usersServiceMock({
      deleteUserById: jest.fn().mockImplementation(() => {
        return EitherI.Right(1)
      }),
    })
    const mockResponse = new MockResponse()
    const controller = new UsersController(usersService, loggerConfig)

    await controller.deleteUserById(
      mockRequest({ id: userId }, null, null),
      mockResponse
    )

    expect(mockResponse.statusCode).toEqual(204)
    expect(usersService.deleteUserById).toBeCalledWith(userId)
  })

  it('returns 500', async () => {
    const usersService: UsersService = usersServiceMock({
      deleteUserById: jest.fn().mockImplementation(() => {
        return EitherI.Left(new Internal())
      }),
    })
    const mockResponse = new MockResponse()
    const controller = new UsersController(usersService, loggerConfig)

    await controller.deleteUserById(
      mockRequest({ id: userId }, null, null),
      mockResponse
    )

    expect(mockResponse.statusCode).toEqual(500)
    expect(usersService.deleteUserById).toBeCalledWith(userId)
  })
})
