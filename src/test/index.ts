import { config } from "dotenv";
import { setup, addUser } from "../index";
import axios from "axios";
import { expect } from "chai";
import { AppDataSource } from "./data-source";
import { User } from "../entities/User";

before(async () => {
  config({ path: `${process.cwd()}/test.env` });
  await AppDataSource.initialize();
  await setup();
});

describe("Hello Query", () => {
  it("should return hello message", async () => {
    console.log("hello");
    const result = await axios.post("http://localhost:4001", {
      query: `
           query Hello {
            hello
            }
            `,
    });
    expect(result.data).to.be.deep.eq({
      data: {
        hello: "Hello world!",
      },
    });
  });
});

const input = {
  name: "beijamin",
  email: "user@email.com",
  password: "1234abc",
  birthDate: "10-10-2000",
};

describe("CreateUser Mutation", () => {
  
  beforeEach(() => {
    AppDataSource.manager.clear(User);
  });

  it("should create a new user", async () => {
    const response = await axios.post("http://localhost:4001", {
      query: `
        mutation CreateUser($data: UserInput!) {
          createUser(data: $data) {
            id
            name
            email
            birthDate
          }
        }
      `,
      variables: {
        data: input,
      },
    });

    delete input.password;

    const { id, ...userFields } = response.data.data.createUser;

    expect(userFields).to.be.deep.eq(input);
  });

  // it("should appear if the user passes an existing email", async () => {

  //   const response = await axios.post("http://localhost:4001", {
  //     query: `
  //       mutation CreateUser($data: UserInput!) {
  //         createUser(data: $data) {
  //           id
  //           name
  //           email
  //           birthDate
  //         }
  //       }
  //     `,
  //     variables: {
  //       data: input,
  //     },
  //   });

  //   expect(response.data.errors[0].message).to.be.eq("Email already exists");
  // });

  it('should appear an error if the password is less than 6 characters', async () => {
    const response = await axios.post('http://localhost:4001', {
      query: `
        mutation createUser($data: UserInput!){
        createUser(data: $data){
          id
          name
          email
          birthDate
        }  
      }
    `,
      variables: {
        data: {
          ...input,
          password: '1'
        }
      }
    });
    expect(response.data.errors[0].message).to.be.equal(
      'Password must contain at least 6 characters'
    );
  });

  it('should appear an error if the password dont contain 1 letter', async () => {
    const response = await axios.post('http://localhost:4001', {
      query: `
        mutation createUser($data: UserInput!){
        createUser(data: $data){
          id
          name
          email
          birthDate
        }  
      }
    `,
      variables: {
        data: {
          ...input,
          password: '123456'
        }
      }
    });

    expect(response.data.errors[0].message).to.be.equal(
      'The password must contain at least 1 letter'
    );
  });

  it('should appear an error if the password dont contain 1 digit', async () => {
    const response = await axios.post('http://localhost:4001', {
      query: `
        mutation createUser($data: UserInput!){
        createUser(data: $data){
          id
          name
          email
          birthDate
        }  
      }
    `,
      variables: {
        data: {
          ...input,
          password: 'abcdef'
        }
      }
    });
    expect(response.data.errors[0].message).to.be.equal(
      'The password must contain at least 1 digit'
    );

  })
});