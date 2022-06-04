import { User, UserCreation } from '../../../model/users'
import { faker } from '@faker-js/faker'
import { randomUUID } from 'crypto'

export function generateUserCreation(
  email?: string,
  name?: string,
  surname?: string
): UserCreation {
  return {
    email: email || faker.internet.email(),
    name: name || faker.name.firstName(),
    surname: surname || faker.name.lastName(),
  }
}

export function generateUser(
  id?: string,
  email?: string,
  name?: string,
  surname?: string,
  createdOn?: Date,
  updatedOn?: Date
): User {
  return {
    id: id || randomUUID({}),
    email: email || faker.internet.email(),
    name: name || faker.name.firstName(),
    surname: surname || faker.name.lastName(),
    createdOn: createdOn || new Date(),
    updatedOn: updatedOn || new Date(),
  }
}
