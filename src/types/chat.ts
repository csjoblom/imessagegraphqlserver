/**
 * Represents a message in a chat
 */
export interface ChatMessage {
  /**
   * The sender's identifier (email, phone number, etc.)
   */
  chatter: string;
  
  /**
   * The message content
   */
  text: string;
  
  /**
   * Timestamp of the message
   */
  date?: number;
  
  /**
   * Whether the message was sent by the current user (1) or received (0)
   */
  is_from_me?: number;
  
  /**
   * Handle ID reference in the iMessage database
   */
  handle_id?: number;
  
  /**
   * Row ID in the message table
   */
  ROWID?: number;
}

/**
 * Represents a chat or conversation
 */
export interface Chat {
  /**
   * Unique identifier for the chat
   */
  name: string;
  
  /**
   * Human-readable name of the chat
   */
  friendlyName: string | null;
  
  /**
   * Chat identifier in the iMessage database
   */
  chat_identifier?: string;
  
  /**
   * Display name in the iMessage database
   */
  display_name?: string | null;
}

/**
 * Represents a count of messages in a chat
 */
export interface ChatCount {
  /**
   * Human-readable name of the chat
   */
  friendlyName: string;
  
  /**
   * Number of messages in the chat
   */
  count: number;
} 