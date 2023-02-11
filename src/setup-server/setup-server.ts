import { ApolloServer } from "apollo-server";
import { resolvers } from "../resolvers/resolvers";
import { typeDefs } from "../schema/schema";

export const setupServer = async () => {

    const server = new ApolloServer({ typeDefs, resolvers });
  
    const { url } = await server.listen(process.env.PORT);
    console.log(`🚀  Server ready at ${url}`);
  };