import { HealthCheckError } from '@godaddy/terminus'

export class ServerHealth {

  constructor() {
  }

  onHealthCheck = async (): Promise<Record<string, string>> => {
    let statusOk = true
    const statusDetails = {}
    if (statusOk) {
      return statusDetails
    } else {
      throw new HealthCheckError('Error', statusDetails)
    }
  }

  onShutdown = async (): Promise<Awaited<void>[]> => {
    return Promise.all([])
  }
}
