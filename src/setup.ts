import { setupServer } from "./setup-server/setup-server";
import { AppDataSource } from "./data-source";


const connectToDB = async () => {
  await AppDataSource.initialize();
  console.log("Database connected!");
};



export async function setup() {
  await connectToDB();
  await setupServer();
}


