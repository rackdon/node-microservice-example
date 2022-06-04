import { DataTypes, ModelAttributes, Sequelize } from 'sequelize'

export class UsersEntity {
  private readonly table: string = 'users'
  private readonly userModel: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdOn: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
      allowNull: false,
    },
    updatedOn: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
      allowNull: false,
    },
  }

  constructor(sequelize: Sequelize) {
    sequelize.define('User', this.userModel, {
      tableName: this.table,
      timestamps: false,
      underscored: true,
    })
  }
}
