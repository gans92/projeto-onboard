import { expect } from "chai";
import { addUser, generateToken, toHashPassword } from "../function";
import { input, invalidToken } from "./constants";
import { queryGetAllUsers } from "./query-users";

describe("query users", async () => {
  //   beforeEach(async () => {
  //     AppDataSource.getRepository(User);
  //   });
  //   afterEach(async () => {
  //     await AppDataSource.getRepository(User).delete({});
  //   });

  it("should return a vector of users", async () => {
    const arrUsers = [];
    const userOne = {
      ...input,
      password: await toHashPassword(input.password),
    };
    const user = await addUser(userOne);
    const token: string = generateToken(user);
    const response = await queryGetAllUsers(token);
    const listUsersResponse = response.data.data.users;
    delete user.password;
    arrUsers.push(user);
    expect(listUsersResponse).to.be.deep.equal(arrUsers);
  });

  it("should appear an error if token is invalid", async () => {
    const userOne = {
      ...input,
      password: await toHashPassword(input.password),
    };
    await addUser(userOne);
    const response = await queryGetAllUsers(invalidToken);
    expect(response.data.errors[0].message).to.be.equal("Invalid token");
    expect(response.data.errors[0].code).to.be.equal(401);
  });

  it("an error should appear if authentication is not passed", async () => {
    const userOne = {
      ...input,
      password: await toHashPassword(input.password),
    };
    await addUser(userOne);
    const response = await queryGetAllUsers("");
    expect(response.data.errors[0].message).to.be.equal(
      "Authentication required"
    );
    expect(response.data.errors[0].code).to.be.equal(401);
  });
});
