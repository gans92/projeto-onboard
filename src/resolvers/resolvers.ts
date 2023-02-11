import { User } from "entities/User";
import { CustomError } from "../errors";
import { addUser, containDigit, containLetter } from "../function";
import * as bcrypt from "bcrypt";

export const resolvers = {
  Query: {
    hello: () => {
      return "Hello world!";
    },
  },

  Mutation: {
    async createUser(_, args) {
      const password = await bcrypt.hash(args.data.password, 10);

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

      // if (await findUserEmail(user.email)) {
      //   throw new CustomError('Email already registered', 409);
      // }

      const userData: User = {
        ...user,
        password,
      };

      return addUser(userData);
    },
  },
};
