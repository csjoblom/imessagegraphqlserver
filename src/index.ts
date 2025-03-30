import { ApolloServer } from 'apollo-server';
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

/**
 * Main server entry point
 */
async function main() {
  // Set up the database connection
  const dbPath = path.join(os.homedir(), 'Library/Messages/chat.db');
  const db = new Database(dbPath);
  
  // Create the terminal UI
  const { screen, statusBox, ipBox, chatHandleBox } = createUI();
  
  // Set up Apollo Server with context
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: { db } // Pass database to resolvers
  });
  
  try {
    // Get the IP address for the server
    const result = await runningAt() as RunningAtResult;
    const ipv4 = result?.address || 'localhost';
    const port = 4000;
    
    // Start the server
    const { url } = await server.listen(port);
    
    // Get the user's chat handle
    const chatHandle = await getLoggedInUseriMessageHandle(db);
    
    // Update UI with server information
    ipBox.setContent(`Server running at: ${url}\nIP: ${ipv4}:${port}`);
    chatHandleBox.setContent(`Current chat handle: ${chatHandle}`);
    statusBox.setContent(`Server started successfully. GraphQL API available at ${url}`);
    
    // Render the UI
    screen.render();
    
    // Setup exit handler
    screen.key(['escape', 'q', 'C-c'], () => {
      statusBox.setContent('Shutting down server...');
      screen.render();
      
      // Close database connection and exit
      db.close().then(() => {
        process.exit(0);
      });
    });
    
    console.log(`🚀 Server running at ${url}`);
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