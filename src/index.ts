import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import db from './_db';

import { typeDefs } from './schema';

const resolvers = {
  Query: {
    games() {
      return db.games;
    },
    reviews() {
      return db.reviews;
    },
    authors() {
      return db.authors;
    }
  }
}

// server setup
async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
  });

  console.log(`Server ready at ${url}`);
}

startServer().catch(console.error);