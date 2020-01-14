const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("./generated/prisma-client");

const resolvers = {
  Query: {
    async user(parent, args, context, info) {
      const user = await prisma.user({ id: args.id });
      console.log("User: ", user);
      return user;
    }
  }
};

const server = new GraphQLServer({
  typeDefs: `${__dirname}/schema.graphql`,
  resolvers
});

server
  .start()
  .then(() => console.log("Server running on http://localhost:4000"));
