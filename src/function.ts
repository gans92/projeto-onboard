import { AppDataSource } from './data-source';
import { User } from './entities/User';

//
export const containLetter = (pass: string): boolean => {
    const letters = new RegExp('[a-zA-Z]')
    const password = pass;
    return letters.test(password);
  };

  export const containDigit = (pass: string) => {
    const digits = new RegExp('[0-9]+');
    const password = pass;
    return digits.test(password);
  };
  
  export const findUserEmail = async (email: string): Promise<boolean> => {
    const userEmail = email;
    const findUser = await AppDataSource.manager.findOneBy(User, {
      email: userEmail
    });
    return !!findUser;
  };


