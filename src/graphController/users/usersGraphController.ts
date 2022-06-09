import { Sequelize } from 'sequelize'
import { PostgresqlClient } from '../../client/postgresql/postgresqlClient'
import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql'
import { resolver } from 'graphql-sequelize'

export class UsersGraphController {
  readonly pgClient: Sequelize
  private readonly userType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
      id: { type: GraphQLString },
      name: { type: GraphQLString },
      surname: { type: GraphQLString },
      createdOn: {
        type: new GraphQLScalarType({
          name: 'Date',
          description: 'Date custom scalar type',
          parseValue(value: unknown) {
            return value
          },
          serialize(value: unknown) {
            return value
          },
        }),
      },
      updatedOn: { type: GraphQLString },
    }),
  })

  constructor(pgClient: PostgresqlClient) {
    this.pgClient = pgClient.client
  }

  getUsersSchema = (): GraphQLSchema => {
    return new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
          users: {
            type: new GraphQLList(this.userType),
            resolve: resolver(this.pgClient.models.User),
          },
        },
      }),
    })
  }
}
