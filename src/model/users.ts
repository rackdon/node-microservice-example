import { PaginationFilters } from './pagination'

export interface User {
  id: string
  email: string
  name: string
  surname: string
  createdOn: Date
  updatedOn: Date
}

export interface UserCreation {
  email: string
  name: string
  surname: string
}

export interface UsersFilters {
  email?: string
  name?: string
  surname?: string
}

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
