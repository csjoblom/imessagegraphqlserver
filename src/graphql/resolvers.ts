import {
  getChats,
  getLoggedInUseriMessageHandle,
  getChatMessagesByArgs,
  sendNewMessage
} from '../imessage';

/**
 * GraphQL resolvers for handling chat-related queries and mutations
 */
export const resolvers = {
  Query: {
    /**
     * Get a list of all chats/conversations
     */
    getChats: async (_: any, __: any, { db }: any) => {
      return await getChats(db);
    },
    
    /**
     * Get messages from a specific chat with optional pagination
     */
    getMessages: async (_: any, args: any, { db }: any) => {
      return await getChatMessagesByArgs(args, db);
    },
    
    /**
     * Send a message to a chat and return the updated messages
     */
    sendMessage: async (_: any, args: any, { db }: any) => {
      const chatId = args.chatId;
      const message = args.message;
      
      if (!chatId || !message) {
        throw new Error('Chat ID and message are required');
      }
      
      await sendNewMessage(chatId, message);
      return await getChatMessagesByArgs({ chatId }, db);
    }
  }
}; 