import _ from "lodash";
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";

export const HelloWorldType = new GraphQLObjectType({
  name: "HelloWorldType",
  fields: () => ({
    greeting: { type: GraphQLString },
  }),
});

const query = new GraphQLObjectType({
  name: "Query",
  fields: {
    hello: {
      type: HelloWorldType,
      resolve: (parentValue: {}, args: any, context: any) => {
        return {
          greeting: "Привет, GraphQL!",
        };
      },
    },
  }
});

const schema = new GraphQLSchema({
  query
});

export { schema };
