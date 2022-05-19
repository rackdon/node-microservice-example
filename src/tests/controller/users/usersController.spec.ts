/* eslint-disable  @typescript-eslint/no-unused-vars */

import { LoggerConfig } from '../../../configuration/loggerConfig'
import { User } from '../../../model/users'
import { UsersService } from '../../../service/users/usersService'
import { usersServiceMock } from '../../mocks/users/usersMocks'
import { mockRequest, MockResponse } from '../utils'
import { UsersController } from '../../../controller/users/usersController'
import { BadRequest, Internal } from '../../../model/error'
import { DataWithPages } from '../../../model/pagination'

describe('Get users', () => {
  const loggerConfig = new LoggerConfig()
  const userData: User = {
    id: 'id',
    email: 'mail@mail.com',
  }
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
