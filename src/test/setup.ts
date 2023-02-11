import "reflect-metadata";
import { ApolloServer, gql } from "apollo-server";
import { AppDataSource } from "./data-source";
import { User } from "../entities/User";
import * as bcrypt from "bcrypt";

const connectionDb = async () => {
  await AppDataSource.initialize();
  console.log("Database connected!");
};

const addUser = async ({ name, email, password, birthDate }: any) => {
  await AppDataSource.manager.insert(User, {
    name,
    email,
    password,
    birthDate,
  });

  const userCreated = {
    name,
    email,
    birthDate,
  };
  return userCreated;
};

const setupServer = async () => {
  const typeDefs = gql`
    type Query {
      hello: String
    }
    type User {
      id: ID!
      name: String!
      email: String!
      birthDate: String
    }

    input UserInput {
      name: String!
      email: String!
      password: String!
      birthDate: String
    }

    type Mutation {
      createUser(data: UserInput!): User!
    }
  `;

  const resolvers = {
    Query: {
      hello: () => {
        return "Hello world!";
      },
    },

    Mutation: {
      async createUser(_: any, args: any) {
        try {
          const password = await bcrypt.hash(args.data.password, 10);

          const user: User = {
            ...args.data,
          };

          const userData = {
            ...user,
            password,
          };

          const result = await addUser(userData);

          return result;
        } catch (error: any) {
          return `message: ${error.message}`;
        }
      },
    },
  };

  const server = new ApolloServer({ typeDefs, resolvers });

  const { url } = await server.listen(process.env.PORT);
  console.log(`🚀  Server ready at ${url}`);
};

export async function setup() {
  await connectionDb();
  await setupServer();
}
