import { ProductDocument } from "../models/productsSchema";
import { UserDocument } from "../models/UserSchema";
import { ProductService } from "../services/ProductService";
import { UserService } from "../services/UserService";

interface Context {
  productService: ProductService;
  userService: UserService;
}

export const resolvers = {
  Query: {
    products: async (_: any, __: any, context: Context) => {
      return context.productService.getAllProducts();
    },
    product: async (_: any, { id }: { id: string }, context: Context) => {
      return context.productService.getProductById(id);
    },
    users: async (_: any, __: any, context: Context) => {
      return context.userService.getAllUsers();
    },
    user: async (_: any, { id }: { id: string }, context: Context) => {
      return context.userService.getUserById(id);
    },
    userByEmail: async (
      _: any,
      { email }: { email: string },
      context: Context
    ) => {
      return context.userService.getUserByEmail(email);
    },
  },
  Mutation: {
    createProduct: async (
      _: any,
      { input }: { input: Omit<ProductDocument, "_id"> },
      context: Context
    ) => {
      return context.productService.createProduct(input);
    },
    updateProduct: async (
      _: any,
      { id, input }: { id: string; input: Partial<ProductDocument> },
      context: Context
    ) => {
      return context.productService.updateProduct(id, input);
    },
    deleteProduct: async (_: any, { id }: { id: string }, context: Context) => {
      return context.productService.deleteProduct(id);
    },
    createUser: async (
      _: any,
      { input }: { input: Omit<UserDocument, "_id"> },
      context: Context
    ) => {
      return context.userService.createUser(input);
    },
    updateUser: async (
      _: any,
      { id, input }: { id: string; input: Partial<UserDocument> },
      context: Context
    ) => {
      return context.userService.updateUser(id, input);
    },
    deleteUser: async (_: any, { id }: { id: string }, context: Context) => {
      return context.userService.deleteUser(id);
    },
  },
};
