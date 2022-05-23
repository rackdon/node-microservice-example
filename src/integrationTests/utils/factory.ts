/* eslint-disable  @typescript-eslint/no-explicit-any */
import { User } from '../../model/users'
import { generateUser } from '../../tests/utils/generators/usersGenerator'
import { Sequelize } from 'sequelize'

export class Factory {
  readonly client: Sequelize

  constructor(client: Sequelize) {
    this.client = client
  }
  private camelToSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
  }

  private async insert(
    tableName: string,
    data: Record<string, any>
  ): Promise<any> {
    const dataKeys: string[] = Object.keys(data).map(this.camelToSnakeCase)
    const dataValues: any[] = Object.values(data).map((x) => {
      if (x.constructor === Date) {
        return `'${x.toString().split(' GMT')[0]}'`
      } else {
        return `'${x.toString()}'`
      }
    })
    const result = await this.client.query(
      `INSERT INTO ${tableName} ( ${dataKeys.join(
        ', '
      )} ) VALUES (${dataValues.join(', ')}) RETURNING *`
    )
    return result[0][0]
  }

  async insertUser(user?: User): Promise<User> {
    return this.insert('users', user || generateUser())
  }
}
