import { AppDataSource } from "./data-source";
import { User } from "./entities/User";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

const letters = new RegExp("[a-zA-Z]");
const digits = new RegExp("[0-9]+");
const isEmail = new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$");

export const containLetter = (pass: string): boolean => {
  return letters.test(pass);
};

export const containDigit = (pass: string) => {
  return digits.test(pass);
};

export const validateEmail = (email: string) => {
  return isEmail.test(email);
};

export const findUserEmail = async (email: string): Promise<boolean> => {
  const userEmail = email;
  const findUser = await AppDataSource.manager.findOneBy(User, {
    email: userEmail,
  });
  return !!findUser;
};

export const addUser = ({ name, email, password, birthDate }: any) => {
  return AppDataSource.manager.save(User, {
    name,
    email,
    password,
    birthDate,
  });
};

export const findUserData = (email: string) => {
  return AppDataSource.manager.findOneBy(User, {
    email,
  });
};

export const findUserById = (id: string) => {
  return AppDataSource.manager.findOneBy(User, {
    id,
  });
};

export const generateToken = (user: User) => {
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
};

export const toHashPassword = (password: string) => {
  return bcrypt.hash(password, 10);
};

export const getAllUsers = async (quantity: number) => {
  return await AppDataSource.manager.getRepository(User).find({
    order: {
      name: "ASC",
    },
    take: quantity,
  });
}
