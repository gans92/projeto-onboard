import * as jwt from 'jsonwebtoken';
import { CustomError } from '../errors';

export const getUserIdByToken = (context) => {
  const authenticationToken = context.auth;

  if (!authenticationToken) {
    throw new CustomError('Authentication required', 401);
  }

  const token = authenticationToken.replace('Bearer ', '');
  
  const decoded = jwt.verify(token,
    `${process.env.JWT_SECRET_KEY},`);

  return decoded['userId'];
};
