import { Sequelize } from 'sequelize'
import { UsersEntity } from './usersEntity'

export class EntitiesInitializer {
  constructor(sequelize: Sequelize) {
    new UsersEntity(sequelize)
  }
}
