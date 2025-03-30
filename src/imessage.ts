import { Database } from './utils/database';
import { ChatRow, HandleRow, MessageRow } from './types/database';
import { Chat, ChatMessage } from './types/chat';
import { exec } from 'child_process';
import { promisify } from 'util';

// Promisify exec for async usage
const execAsync = promisify(exec);

/**
 * Gets the currently logged-in user's iMessage handle
 * 
 * @param database Database instance to use for queries
 * @returns The user's iMessage handle (email) or error message
 */
export async function getLoggedInUseriMessageHandle(
  database: Database
): Promise<string> {
  try {
    const sql = 'SELECT DISTINCT account_login FROM chat WHERE service_name = ?';
    const rows = await database.query<ChatRow>(sql, ['iMessage']);
    
    if (!rows || rows.length === 0) {
      return 'no chat handle! [1]';
    }
    
    if (!rows[0].account_login) {
      return 'no chat handle! [2]';
    }
    
    return rows[0].account_login.split('E:')[1];
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to get iMessage handle: ${errorMessage}`);
  }
}

/**
 * Gets a list of all chats/conversations
 * 
 * @param database Database instance to use for queries
 * @returns Array of Chat objects
 */
export async function getChats(database: Database): Promise<Chat[]> {
  try {
    const sql = `
      SELECT DISTINCT 
        handle.id,
        chat.chat_identifier,
        chat.display_name
      FROM
        message
      LEFT OUTER JOIN chat ON chat.room_name = message.cache_roomnames 
      LEFT OUTER JOIN handle ON handle.ROWID = message.handle_id
      WHERE
        message.is_from_me = 0 AND 
        message.service = 'iMessage'
      ORDER BY message.date DESC
    `;
    
    const rows = await database.query<ChatRow & HandleRow>(sql);
    const result: Chat[] = [];
    const seenNames = new Set<string>();
    
    for (const row of rows) {
      let chatId: string | undefined;
      
      // Handle direct chat messages
      if (row.chat_identifier === null) {
        chatId = row.id;
      } 
      // Handle group chats
      else if (row.chat_identifier?.includes('chat') && row.display_name) {
        chatId = row.display_name + '-' + row.chat_identifier;
      } 
      // Handle other chats
      else {
        chatId = row.chat_identifier;
      }
      
      // Skip if no ID or already seen
      if (!chatId || seenNames.has(chatId)) {
        continue;
      }
      
      seenNames.add(chatId);
      
      result.push({
        name: chatId,
        friendlyName: row.display_name || null
      });
    }
    
    return result;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to get chats: ${errorMessage}`);
  }
}

/**
 * Gets messages from a chat based on the provided arguments
 * 
 * @param args Arguments including chatId and optional pagination
 * @param database Database instance to use for queries
 * @returns Array of ChatMessage objects
 */
export async function getChatMessagesByArgs(
  args: { chatId?: string; page?: string },
  database: Database
): Promise<ChatMessage[]> {
  try {
    if (!args.chatId) {
      return [];
    }
    
    const chatId = args.chatId;
    let limit = 20;
    let offset = 0;
    
    if (args.page) {
      offset = (parseInt(args.page) - 1) * limit;
    }
    
    let sql: string;
    let params: any[];
    
    // For group chats (format: "GroupName-chat123456")
    if (chatId.includes('-chat')) {
      const [displayName, roomName] = chatId.split('-');
      sql = `
        SELECT
          message.ROWID,
          message.date,
          message.text,
          message.is_from_me,
          message.handle_id,
          handle.id AS chatter
        FROM
          message
        LEFT OUTER JOIN handle ON handle.ROWID = message.handle_id
        LEFT OUTER JOIN chat ON chat.room_name = message.cache_roomnames
        WHERE
          chat.room_name = ? AND
          message.service = 'iMessage'
        ORDER BY message.date DESC
        LIMIT ? OFFSET ?
      `;
      params = [roomName, limit, offset];
    } else {
      // For direct messages
      sql = `
        SELECT
          message.ROWID,
          message.date,
          message.text,
          message.is_from_me,
          message.handle_id,
          handle.id AS chatter
        FROM
          message
        LEFT OUTER JOIN handle ON handle.ROWID = message.handle_id
        WHERE
          handle.id = ? AND
          message.service = 'iMessage'
        ORDER BY message.date DESC
        LIMIT ? OFFSET ?
      `;
      params = [chatId, limit, offset];
    }
    
    const messages = await database.query<MessageRow & { chatter: string }>(sql, params);
    
    return messages.map(msg => ({
      ROWID: msg.ROWID,
      chatter: msg.chatter || (msg.is_from_me ? 'me' : chatId),
      text: msg.text || '',
      date: msg.date,
      is_from_me: msg.is_from_me,
      handle_id: msg.handle_id
    }));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to get messages: ${errorMessage}`);
  }
}

/**
 * Sends a new message to the specified chat
 * 
 * @param chatId ID of the chat to send the message to
 * @param message Text content of the message
 * @returns Promise resolving to true on success
 */
export async function sendNewMessage(
  chatId: string,
  message: string
): Promise<boolean> {
  try {
    // For macOS, we use AppleScript to send iMessages
    const script = `
      tell application "Messages"
        set targetService to 1st service whose service type = iMessage
        set targetBuddy to buddy "${chatId}" of targetService
        send "${message}" to targetBuddy
      end tell
    `;
    
    await execAsync(`osascript -e '${script}'`);
    return true;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to send message: ${errorMessage}`);
  }
} 