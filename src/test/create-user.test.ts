import { expect } from "chai";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { input } from "./constants";
import { queryCreateUser } from "./query-create-user";

describe("CreateUser Mutation", () => {
  beforeEach(() => {
    AppDataSource.manager.clear(User);
  });

  it("should create a new user", async () => {
    const response = await queryCreateUser(input);
    delete input.password;
    const { id, ...userFields } = response.data.data.createUser;
    expect(userFields).to.be.deep.eq(input);
    expect(id).to.be.a("string");
  });

  // it("should appear if the user passes an existing email", async () => {

  //   const response = await QueryCreateUser(input2)

  //   expect(response.data.errors[0].message).to.be.eq("         Email already registered");
  // });

  it("should appear an error if the password is less than 6 characters", async () => {
    const newInput = { ...input, password: "12345" };
    const response = await queryCreateUser(newInput);
    expect(response.data.errors[0].message).to.be.equal(
      "Password must contain at least 6 characters"
    );
    expect(response.data.errors[0].code).to.be.equal(400);
  });

  it("should appear an error if the password dont contain 1 letter", async () => {
    const newInput = { ...input, password: "123456" };
    const response = await queryCreateUser(newInput);
    expect(response.data.errors[0].message).to.be.equal(
      "The password must contain at least 1 letter"
    );
    expect(response.data.errors[0].code).to.be.equal(400);
  });

  it("should appear an error if the password dont contain 1 digit", async () => {
    const newInput = { ...input, password: "abcdef" };
    const response = await queryCreateUser(newInput);
    expect(response.data.errors[0].message).to.be.equal(
      "The password must contain at least 1 digit"
    );
    expect(response.data.errors[0].code).to.be.equal(400);
  });

  // it('should appear an error if the email is of an invalid format', async () => {
  //   const user: User = await addUser(input);
  //   const token: string = generateToken(user);
  //   const newInput = { ...input2, email: 'teste' };
  //   const response = await queryCreateUser(newInput, token);
  //     expect(response.data.errors[0].message).to.be.equal('Invalid email format');
  //     expect(response.data.errors[0].extensions.exception.code).to.be.equal(400);
  //   });
});
