import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { Database } from './utils/database';
import { createUI } from './ui/terminal';
import { getLoggedInUseriMessageHandle } from './imessage';
import runningAt from 'running-at';
import path from 'path';
import os from 'os';

// Type declaration for runningAt result
interface RunningAtResult {
  address?: string;
  port?: number;
}

// Type for context
interface ApolloContext {
  db: Database;
}

/**
 * Main server entry point
 */
async function main() {
  // Set up the database connection
  const dbPath = path.join(os.homedir(), 'Library/Messages/chat.db');
  const db = new Database(dbPath);
  
  // Create the terminal UI
  const { screen, statusBox, ipBox, chatHandleBox } = createUI();
  
  try {
    // Create Express app and HTTP server
    const app = express();
    const httpServer = http.createServer(app);
    const port = 4000;
    
    // Set up Apollo Server
    const server = new ApolloServer<ApolloContext>({
      typeDefs,
      resolvers
    });
    
    // Start the Apollo server
    await server.start();
    
    // Enable CORS
    app.use(cors());
    
    // Apply middleware to Express
    app.use('/graphql', express.json(), express.urlencoded({ extended: true }));
    
    // Apply Apollo middleware
    app.use('/graphql', 
      // @ts-ignore - Ignoring type issues with express middleware compatibility
      expressMiddleware(server, {
        context: async () => ({ db })
      })
    );
    
    // Get server IP address
    const result = await runningAt() as RunningAtResult;
    const ipv4 = result?.address || 'localhost';
    
    // Start HTTP server
    httpServer.listen(port, () => {
      const url = `http://${ipv4}:${port}/graphql`;
      console.log(`🚀 Server ready at ${url}`);
      
      // Get the user's chat handle and update UI
      getLoggedInUseriMessageHandle(db).then(chatHandle => {
        ipBox.setContent(`Server running at: ${url}\nIP: ${ipv4}:${port}`);
        chatHandleBox.setContent(`Current chat handle: ${chatHandle}`);
        statusBox.setContent(`Server started successfully. GraphQL API available at ${url}`);
        screen.render();
      });
    });
    
    // Setup exit handler
    screen.key(['escape', 'q', 'C-c'], () => {
      statusBox.setContent('Shutting down server...');
      screen.render();
      
      // Close server and database connection, then exit
      server.stop().then(() => {
        httpServer.close(() => {
          db.close().then(() => {
            process.exit(0);
          });
        });
      });
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    statusBox.setContent(`Error starting server: ${errorMessage}`);
    screen.render();
    
    // Exit after 5 seconds
    setTimeout(() => {
      db.close().then(() => {
        process.exit(1);
      });
    }, 5000);
  }
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 