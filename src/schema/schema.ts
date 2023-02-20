import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    user(id: ID!): User!
    users(quantity: Int = 10, page: Int = 1): UserList
  }

  type User {
    id: ID!
    name: String!
    email: String!
    birthDate: String
  }

  type UserList {
    users: [User!]!
    count: Int
    before: Int
    after: Int
    page: Int
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
    createAddress(data: AddressInput!): Address!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Auth {
    user: User!
    token: String!
  }

  type Address {
    id: ID!
    cep: String!
    street: String!
    streetNumber: Int!
    complement: String!
    neighborhood: String!
    city: String!
    state: String!
  }

  input AddressInput {
    cep: String!
    street: String!
    streetNumber: Int!
    complement: String!
    neighborhood: String!
    city: String!
    state: String!
    user: String!
  }

`;
