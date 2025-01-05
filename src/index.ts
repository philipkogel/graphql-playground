import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import db from './_db';

import { typeDefs } from './schema';

const resolvers = {
  Query: {
    games() {
      return db.games;
    },
    game(_: any, args: { id: string }) {
      return db.games.find((game) => game.id === args.id);
    },
    reviews() {
      return db.reviews;
    },
    review(_: any, args: { id: string }) {
      return db.reviews.find((review) => review.id === args.id);
    },
    authors() {
      return db.authors;
    },
    author(_: any, args: { id: string }) {
      return db.authors.find((author) => author.id === args.id);
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