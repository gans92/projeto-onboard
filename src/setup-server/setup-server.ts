import { ApolloServer } from "apollo-server";
import { resolvers } from "../resolvers/resolvers";
import { typeDefs } from "../schema/schema";
import { formatError } from "../errors";

export const setupServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,

    context: ({ req }) => {
      const auth = req.headers.authorization || "";
      return { auth };
    },
    formatError
  });

  const { url } = await server.listen(process.env.PORT);
  console.log(`🚀  Server ready at ${url}`);
};
