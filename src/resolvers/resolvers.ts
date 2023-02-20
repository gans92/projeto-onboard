import * as bcrypt from "bcrypt";
import { AppDataSource } from "../data-source";
import { Address } from "../entities/address";
import { User } from "../entities/User";
import { CustomError } from "../errors";
import {
  addAddress,
  addUser,
  containDigit,
  containLetter,
  findUserById,
  findUserData,
  findUserEmail,
  generateToken,
  getCountUsers,
  getUsersAndAddress,
  toHashPassword,
  validateEmail,
} from "../function";
import { getUserIdByToken } from "../utils/get-userId-token";

export const resolvers = {
  Query: {
    user: async (_, args, context: { req }) => {
      const userId = getUserIdByToken(context);
      if (!userId) {
        throw new CustomError("Unauthorized", 401);
      }
      const user = await findUserById(args.id);
      // if (!user) {
      //   throw new CustomError("User not found", 404);
      // }
      return user;
    },

    users: async (_, args, context: { req }) => {
      // const userId = getUserIdByToken(context);
      // if (userId !== args.id) {
      //   throw new CustomError("Unauthorized", 401);
      // }
      const quantity = args.quantity;
      const page = args.page;

      const users = await getUsersAndAddress(quantity, page);
      const totalUsers = await getCountUsers();

      return {
        users: users,
        count: totalUsers,
        before:
        quantity * (page - 1) > totalUsers,
        after: page * quantity > totalUsers ? 0 : totalUsers - page * quantity,
        page,
      };
    },
  },

  Mutation: {
    async createUser(_, args) {
      const password = await toHashPassword(args.data.password);

      const user: User = {
        ...args.data,
      };

      if (user.password.length < 6) {
        throw new CustomError(
          "Password must contain at least 6 characters",
          400
        );
      }

      if (!containLetter(user.password)) {
        throw new CustomError(
          "The password must contain at least 1 letter",
          400
        );
      }

      if (!containDigit(user.password)) {
        throw new CustomError(
          "The password must contain at least 1 digit",
          400
        );
      }

      if (await findUserEmail(user.email)) {
        throw new CustomError("Email already registered", 409);
      }

      const userData: User = {
        ...user,
        password,
      };

      if (!validateEmail(user.email)) {
        throw new CustomError("Invalid email format", 400);
      }

      return addUser(userData);
    },

    async login(_, args) {
      const user = await findUserData(args.data.email);

      if (!user) {
        throw new CustomError("Unable to login", 401);
      }

      const valid = await bcrypt.compare(args.data.password, user.password);

      if (!valid) {
        throw new CustomError("Unable to login", 401);
      }

      return {
        user,
        token: generateToken(user),
      };
    },

    async createAddress (_, args, context: { req }) {
      // const userId = getUserIdByToken(context);
      // if (!userId) {
      //   throw new CustomError("Unauthorized", 401);
      // }
      
     const address = args.data

     return addAddress(address)
    }
  },
};
