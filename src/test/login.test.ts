import { expect } from 'chai';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { queryLogin } from './query-login';
import { queryCreateUser } from './query-create-user';
import { loginInput, input } from './constants';

describe('Login Mutation', async () => {
  beforeEach(async () => {
    await AppDataSource.getRepository(User).delete({});
  });

  // it('should login', async () => {
  //   await queryCreateUser(input);
  //   const findUser = await AppDataSource.manager.findOneBy(User, {
  //     email: loginInput.email
  //   });
  //   const response = await queryLogin(loginInput);
  //   const user = response.data.data.login.user;
  //   delete findUser.password;
  //   delete user.password;
  //   const token = response.data.data.login.token;
  //   const decoded = jwt.verify(token, 
  //       process.env.JWT_SECRET as string);
  //   const tokenPayload = decoded as jwt.JwtPayload;
  //   expect(user).to.be.deep.equal(findUser);
  //   expect(tokenPayload.email).to.be.equal(findUser.email);
  //   expect(tokenPayload.userId).to.be.equal(findUser.id);
  // });

  it('should not be able to login with wrong password', async () => {
    await queryCreateUser(input);
    const newLogin = { ...loginInput, password: 'alecrim1' };
    const response = await queryLogin(newLogin);
    expect(response.data.errors[0].message).to.be.equal('Unable to login');
    expect(response.data.errors[0].code).to.be.equal(401);
  });

  it('should not be able to login with email that does not exist', async () => {
    await queryCreateUser(input);
    const newLogin = { ...loginInput, email: 'teste@gmail.com' };
    const response = await queryLogin(newLogin);
    expect(response.data.errors[0].message).to.be.equal('Unable to login');
    expect(response.data.errors[0].code).to.be.equal(401);
  });
});