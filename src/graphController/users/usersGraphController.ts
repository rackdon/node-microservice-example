import { Sequelize } from "sequelize";
import { PostgresqlClient } from "../../client/postgresql/postgresqlClient";
import { GraphQLList, GraphQLObjectType, GraphQLScalarType, GraphQLSchema, GraphQLString, Kind } from "graphql";
import { resolver } from "graphql-sequelize";

export class UsersGraphController {
  readonly pgClient: Sequelize
  private readonly userType =  new GraphQLObjectType({
    name: 'User',
    fields: () => ({
      id: { type: GraphQLString },
      name: { type: GraphQLString },
      surname: { type: GraphQLString },
      createdOn: {type: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value: any) {
          return new Date(value); // value from the client
        },
        serialize(value: any) {
          return value; // value sent to the client
        },
      })},
      updatedOn: { type: GraphQLString },
    })
  })

  constructor(pgClient: PostgresqlClient) {
    this.pgClient = pgClient.client
  }

  getUsersSchema = (): GraphQLSchema => {
    return new GraphQLSchema({
        query: new GraphQLObjectType<any, any>(
          {
            name: 'RootQueryType',
            fields: {
              users: {
                type: new GraphQLList(this.userType),
                resolve: resolver(this.pgClient.models.User)
              }
            }
          })
      })
  }
}