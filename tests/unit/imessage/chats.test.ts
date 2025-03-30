import { test, expect, describe, beforeEach, afterEach } from 'bun:test';
import { Database } from '../../../src/utils/database';
import { getChats } from '../../../src/imessage';
import { Chat } from '../../../src/types/chat';

// Mock the Database class
class MockDatabase {
  mockQueryResult: any = [];
  mockError: Error | null = null;
  
  constructor() {}
  
  async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    if (this.mockError) {
      throw this.mockError;
    }
    
    return this.mockQueryResult as T[];
  }
  
  async close(): Promise<void> {
    return Promise.resolve();
  }
}

describe('Chat Functions', () => {
  let mockDb: MockDatabase;
  
  beforeEach(() => {
    mockDb = new MockDatabase();
  });
  
  test('should return list of chats with proper structure', async () => {
    // Set up the mock to return chat data
    mockDb.mockQueryResult = [
      {
        id: '+11234567890',
        chat_identifier: '+11234567890',
        display_name: 'John Doe'
      },
      {
        id: '+10987654321',
        chat_identifier: '+10987654321',
        display_name: null
      }
    ];
    
    const result = await getChats(mockDb as unknown as Database);
    
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    expect(result[0]).toHaveProperty('name');
    expect(result[0]).toHaveProperty('friendlyName');
    expect(result[0].name).toBe('+11234567890');
    expect(result[0].friendlyName).toBe('John Doe');
  });
  
  test('should return empty array when no chats found', async () => {
    // Set up the mock to return empty data
    mockDb.mockQueryResult = [];
    
    const result = await getChats(mockDb as unknown as Database);
    
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
  
  test('should handle database errors', async () => {
    // Set up the mock to throw an error
    mockDb.mockError = new Error('Database error');
    
    await expect(getChats(mockDb as unknown as Database))
      .rejects.toThrow('Failed to get chats: Database error');
  });
}); 