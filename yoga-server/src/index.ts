import { GraphQLServer } from 'graphql-yoga'
import { prisma } from './generated'
import { Context } from './utils'

const resolvers = {
  Query: {
  },
  Mutation: {
  },
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { prisma },
});

server.start(() => console.log('Server is running on http://localhost:4000'));
