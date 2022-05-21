/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Pool } from 'pg'
import { User, UserCreation } from '../../model/users'
import { generateUserCreation } from '../../tests/utils/generators/usersGenerator'

export class Factory {
  readonly client: Pool

  constructor(pool: Pool) {
    this.client = pool
  }

  private async insert(
    tableName: string,
    data: Record<string, any>
  ): Promise<any> {
    const dataKeys: string[] = Object.keys(data)
    const dataValues: any[] = Object.values(data)
    const dollarValues: string[] = [...Array(dataKeys.length).keys()].map(
      (x) => `$${x + 1}`
    )
    const result = await this.client.query(
      `INSERT INTO ${tableName} (${dataKeys.join(
        ','
      )}) VALUES (${dollarValues.join(',')}) RETURNING *`,
      dataValues
    )
    return result.rows[0]
  }

  async insertUser(userCreation?: UserCreation): Promise<User> {
    return this.insert('users', userCreation || generateUserCreation())
  }
}
