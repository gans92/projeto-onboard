import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    user(id: ID!): User!
    users(quantity: Int = 10): [User!]!
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
    login(data: LoginInput!) : Auth!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Auth {
    user: User!
    token: String!
  }

`;
