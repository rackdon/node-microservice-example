import { PaginationFilters } from './pagination'

export interface User {
  id: string
  email: string
  name: string
  surname: string
  createdOn: Date
  updatedOn: Date
}

export type UserCreation = Pick<User, 'email' | 'name' | 'surname'>

export type UserEdition = Partial<Pick<User, 'name' | 'surname'>>

export type UsersFilters = Partial<Pick<User, 'email' | 'name' | 'surname'>>

export function toUsersFilters({
  email,
  name,
  surname,
}: PaginatedUsersFilters): UsersFilters {
  return {
    email,
    name,
    surname,
  }
}

export type PaginatedUsersFilters = UsersFilters & PaginationFilters
