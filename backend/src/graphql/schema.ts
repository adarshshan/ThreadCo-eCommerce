import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Product {
    _id: ID!
    name: String!
    price: Float!
    description: String!
    stock: Int!
  }

  type User {
    _id: ID!
    email: String!
    name: String!
    role: String!
  }

  input ProductInput {
    name: String!
    price: Float!
    description: String!
    stock: Int!
  }

  input ProductUpdateInput {
    name: String
    price: Float
    description: String
    stock: Int
  }

  input UserInput {
    email: String!
    password: String
    name: String!
    role: String
  }

  input UserUpdateInput {
    email: String
    name: String
    role: String
  }

  type Query {
    products: [Product!]!
    product(id: ID!): Product
    users: [User!]!
    user(id: ID!): User
    userByEmail(email: String!): User
  }

  type Mutation {
    createProduct(input: ProductInput!): Product!
    updateProduct(id: ID!, input: ProductUpdateInput!): Product
    deleteProduct(id: ID!): Boolean!
    createUser(input: UserInput!): User!
    updateUser(id: ID!, input: UserUpdateInput!): User
    deleteUser(id: ID!): Boolean!
  }
`;
