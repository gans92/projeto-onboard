import { User } from "../entities/User";
import { CustomError } from "../errors";
import {
  addUser,
  containDigit,
  containLetter,
  findUserData,
  findUserEmail,
  generateToken,
  toHashPassword,
  validateEmail,
  findUserById
} from "../function";
import * as bcrypt from "bcrypt";
import { getUserIdByToken } from "../utils/get-userId-token";

export const resolvers = {
  Query: {
    user: async (_, args, context: { req }) => {
      const user = await findUserById(args.id);
      if (!user) {
        throw new CustomError("User not found", 404);
      }

      const userId = getUserIdByToken(context);
      if (!(await findUserById(userId))) {
        throw new CustomError("invalid token", 404);
      }
      
      return user;
    },
  },

  Mutation: {
    async createUser(_, args) {
      const password = await toHashPassword(args.data.password)

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
        throw new CustomError('Email already registered', 409);
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
        token: generateToken(user)
      };
    }
  },
};


