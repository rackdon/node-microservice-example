import { PaginationFilters } from './pagination'

export interface User {
  id: string
  email: string
  createdOn: Date
}

export interface UserCreation {
  email: string
}

export interface UsersFilters {
  email?: string
}

export function toUsersFilters({ email }: PaginatedUsersFilters): UsersFilters {
  return {
    email,
  }
}

export type PaginatedUsersFilters = UsersFilters & PaginationFilters
