import * as jwt from 'jsonwebtoken';

export const getUserId = (request) => {
  const header = request.request.headers.authorization;

  if (!header) {
    throw new Error('Authentication required');
  }

  const token = header.replace('Bearer ', '');
  const decoded = jwt.verify(token,
    `${process.env.JWT_SECRET_KEY}`);

  return decoded;
};