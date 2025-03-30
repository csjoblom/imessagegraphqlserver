import { gql } from 'apollo-server';

/**
 * GraphQL type definitions for the iMessage API
 */
export const typeDefs = gql`
  """
  Represents a message in a chat
  """
  type ChatMessage {
    """
    The sender's identifier (email, phone number, etc.)
    """
    chatter: String!
    
    """
    The message content
    """
    text: String!
    
    """
    Timestamp of the message
    """
    date: Float
    
    """
    Whether the message was sent by the current user (1) or received (0)
    """
    is_from_me: Int
    
    """
    Handle ID reference in the iMessage database
    """
    handle_id: Int
    
    """
    Row ID in the message table
    """
    ROWID: Int
  }

  """
  Represents a chat or conversation
  """
  type Chat {
    """
    Unique identifier for the chat
    """
    name: String!
    
    """
    Human-readable name of the chat
    """
    friendlyName: String
  }

  """
  Represents a count of messages in a chat
  """
  type ChatCount {
    """
    Human-readable name of the chat
    """
    friendlyName: String!
    
    """
    Number of messages in the chat
    """
    count: Int!
  }

  """
  Root query type
  """
  type Query {
    """
    Get list of all chats/conversations
    """
    getChats: [Chat]
    
    """
    Get count of messages in each chat
    """
    getChatCounts: [ChatCount]
    
    """
    Get messages in a chat, with optional pagination
    """
    getMessages(chatId: String, page: String): [ChatMessage]
    
    """
    Send a message to a chat and return the updated messages
    """
    sendMessage(chatId: String, message: String): [ChatMessage]
  }
`; 