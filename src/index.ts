import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import db from './_db';

import { typeDefs } from './schema';

const resolvers = {
  Query: {
    games(_: any, args: { limit: number, offset: number }) {
      return db.games.slice(args.offset, args.offset + args.limit);
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
  },
  Game: {
    reviews(parent: { id: string}) {
      return db.reviews.filter((review) => review.game_id === parent.id);
    }
  },
  Author: {
    reviews(parent: { id: string }) {
      return db.reviews.filter((review) => review.author_id === parent.id);
    }
  },
  Review: {
    game(parent: { game_id: string }) {
      return db.games.find((game) => game.id === parent.game_id);
    },
    author(parent: { author_id: string }) {
      return db.authors.find((author) => author.id === parent.author_id);
    }
  },
  Mutation: {
    deleteGame(_: any, args: { id: string }) {
      db.games = db.games.filter((game) => game.id !== args.id);

      return db.games;
    },
    addGame(_: any, args: { game: { title: string, platform: string[] } }) {
      let game = { ...args.game, id: String(db.games.length + 1) };
      db.games.push(game);

      return game;
    },
    updateGame(_: any, args: { id: string, edits: { title?: string, platform?: string[] } }) {
      let updatedGame;
      db.games = db.games.map((game) => {
        if (game.id === args.id) {
          updatedGame = { ...game, ...args.edits };
          return updatedGame;
        }

        return game;
      })

      return updatedGame;
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