import { AxiosResponse } from 'axios'
import { LoggerConfig } from '../configuration/loggerConfig'

export class BadRequest {
  errors: string[]

  constructor(errors: string[]) {
    this.errors = errors
  }
}

export class Conflict {
  errors: string[]

  constructor(errors?: string[]) {
    this.errors = errors || []
  }
}

export class Forbidden {}

export class NotFound {}

export class Internal {}

export class ServiceUnavailable {}

export type ApiError =
  | BadRequest
  | NotFound
  | Forbidden
  | Conflict
  | Internal
  | ServiceUnavailable

function formatSchemaErrors(responseErrors: Record<string, string>): string[] {
  return Object.entries(responseErrors).map(([k, v]) => `${k} ${v}`)
}

const logger = new LoggerConfig().create('ErrorHandler')
export const handleBadRequest = (axiosResponse: AxiosResponse): ApiError => {
  const badError = axiosResponse.data.error
  const receivedError = axiosResponse.data.errors || axiosResponse.data.error
  let errors: string[]
  if (!receivedError || badError) {
    logger.warn(
      `Making request to ${axiosResponse.request} received ${axiosResponse.data} that have the key 'error' or without data. Fix this asap`
    )
  }
  if (Array.isArray(receivedError)) {
    errors = receivedError
  } else if (typeof receivedError === 'string') {
    errors = [receivedError]
  } else {
    errors = formatSchemaErrors(receivedError)
  }
  return new BadRequest(errors)
}

export const handleConflict = (axiosResponse: AxiosResponse): ApiError => {
  const badConflict = axiosResponse.data?.error
  const receivedConflicts =
    axiosResponse.data?.errors || axiosResponse.data?.error
  let errors: string[] | null
  if (!receivedConflicts || badConflict) {
    logger.warn(
      `Making request to ${axiosResponse.request} received ${axiosResponse.data} that have the key 'error' or without data. Fix this asap`
    )
  }
  if (Array.isArray(receivedConflicts)) {
    errors = receivedConflicts
  } else if (typeof receivedConflicts == 'object') {
    errors = formatSchemaErrors(receivedConflicts)
  } else if (typeof receivedConflicts === 'string') {
    errors = [receivedConflicts]
  } else {
    errors = null
  }

  return errors ? new Conflict(errors) : new Conflict()
}
