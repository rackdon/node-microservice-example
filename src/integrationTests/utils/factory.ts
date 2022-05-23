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
  private toCamel(str: string): string {
    return str.replace(/([-_][a-z])/gi, ($1) =>
      $1.toUpperCase().replace('_', '')
    )
  }

  private parseKeys<T>(obj: Record<string, any>): T {
    return Object.keys(obj).reduce((acc: Record<string, any>, k: string) => {
      acc[this.toCamel(k)] = obj[k]
      return acc
    }, {}) as T
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
    const insertedUser = await this.insert('users', user || generateUser())
    return this.parseKeys<User>(insertedUser)
  }
}
