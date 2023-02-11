import { gql } from "apollo-server";

export const typeDefs = gql`
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
