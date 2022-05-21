import { User, UserCreation } from '../../../model/users'
import { faker } from '@faker-js/faker'
import { randomUUID } from 'crypto'

export function generateUserCreation(email?: string): UserCreation {
  return {
    email: email || faker.internet.email(),
  }
}

export function generateUser(
  id?: string,
  email?: string,
  createdOn?: Date
): User {
  return {
    id: id || randomUUID({}),
    email: email || faker.internet.email(),
    createdOn: createdOn || new Date(),
  }
}
