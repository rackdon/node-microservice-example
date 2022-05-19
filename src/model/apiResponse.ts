import { ApiError } from './error'

export interface NoContent {}

export interface Created {}

export type ApiResponse<T> = [T, null] | [null, ApiError]
