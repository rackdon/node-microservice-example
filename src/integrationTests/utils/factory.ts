/* eslint-disable  @typescript-eslint/no-explicit-any */
import { User, UserCreation } from '../../model/users'
import { generateUserCreation } from '../../tests/utils/generators/usersGenerator'
import { Sequelize } from 'sequelize'

export class Factory {
  readonly client: Sequelize

  constructor(client: Sequelize) {
    this.client = client
  }

  private async insert(
    tableName: string,
    data: Record<string, any>
  ): Promise<any> {
    const dataKeys: string[] = Object.keys(data)
    const dataValues: any[] = Object.values(data).map((x) => {
      if (typeof x === 'string') {
        return `'${x}'`
      } else {
        return x
      }
    })
    const result = await this.client.query(
      `INSERT INTO ${tableName} (${dataKeys.join(
        ','
      )}) VALUES (${dataValues.join(',')}) RETURNING *`
    )
    return result[0][0]
  }

  async insertUser(userCreation?: UserCreation): Promise<User> {
    return this.insert('users', userCreation || generateUserCreation())
  }
}
