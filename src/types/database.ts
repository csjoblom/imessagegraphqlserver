/**
 * Generic database row type that allows accessing any property
 */
export interface DatabaseRow {
  [key: string]: any;
}

/**
 * Represents a row from the chat table
 */
export interface ChatRow extends DatabaseRow {
  /**
   * Primary key of the chat row
   */
  ROWID?: number;
  
  /**
   * Identifier of the chat (phone number, email, or chat identifier)
   */
  chat_identifier?: string;
  
  /**
   * Display name of the chat
   */
  display_name?: string | null;
  
  /**
   * Service name (e.g., 'iMessage')
   */
  service_name?: string;
  
  /**
   * Room name in the chat database
   */
  room_name?: string;
  
  /**
   * Account login identifier (e.g., 'E:user@example.com')
   */
  account_login?: string;
}

/**
 * Represents a row from the message table
 */
export interface MessageRow extends DatabaseRow {
  /**
   * Primary key of the message row
   */
  ROWID?: number;
  
  /**
   * Timestamp of the message
   */
  date?: number;
  
  /**
   * Text content of the message
   */
  text?: string;
  
  /**
   * Whether the message was sent by the user (1) or received (0)
   */
  is_from_me?: number;
  
  /**
   * Foreign key reference to the handle table
   */
  handle_id?: number;
  
  /**
   * Cache of room names for this message
   */
  cache_roomnames?: string;
  
  /**
   * Service name (e.g., 'iMessage')
   */
  service?: string;
}

/**
 * Represents a row from the handle table
 */
export interface HandleRow extends DatabaseRow {
  /**
   * Primary key of the handle row
   */
  ROWID?: number;
  
  /**
   * Identifier of the handle (phone number or email)
   */
  id?: string;
  
  /**
   * Service name (e.g., 'iMessage')
   */
  service?: string;
} 