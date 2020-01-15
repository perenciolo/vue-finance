const { GraphQLServer } = require('graphql-yoga');
const Binding = require('prisma-binding');
const { prisma } = require('./generated/prisma-client');

const { PRISMA_ENDPOINT, PRISMA_SERVICE, PRISMA_STAGE } = process.env;

const resolvers = require('./resolvers');

const server = new GraphQLServer({
  typeDefs: `${__dirname}/schema.graphql`,
  resolvers,
  context: request => ({
    ...request,
    binding: new Binding.Prisma({
      typeDefs: `${__dirname}/generated/graphql-schema/prisma.graphql`,
      endpoint: `${PRISMA_ENDPOINT}/${PRISMA_SERVICE}/${PRISMA_STAGE}`
    }),
    prisma
  })
});

server
  .start()
  .then(() => console.log('Server running on http://localhost:4000'));
