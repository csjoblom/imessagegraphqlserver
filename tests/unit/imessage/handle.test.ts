import { test, expect, describe, beforeEach, afterEach, mock } from 'bun:test';
import { Database } from '../../../src/utils/database';
import { getLoggedInUseriMessageHandle } from '../../../src/imessage';

// Mock the Database class
class MockDatabase {
  mockQueryResult: any = [];
  mockError: Error | null = null;
  
  constructor() {}
  
  async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    if (this.mockError) {
      throw this.mockError;
    }
    
    // For debugging
    if (sql.includes('account_login') && Array.isArray(params) && params[0] === 'iMessage') {
      // Verify correct query parameters were used
    }
    
    return this.mockQueryResult as T[];
  }
  
  async close(): Promise<void> {
    return Promise.resolve();
  }
}

describe('iMessage Handle Functions', () => {
  let mockDb: MockDatabase;
  
  beforeEach(() => {
    mockDb = new MockDatabase();
  });
  
  test('should return the correct handle when found', async () => {
    // Set up the mock to return a specific account login
    mockDb.mockQueryResult = [{ account_login: 'E:test@example.com' }];
    
    const result = await getLoggedInUseriMessageHandle(mockDb as unknown as Database);
    
    expect(result).toBe('test@example.com');
  });
  
  test('should return error message when no rows', async () => {
    // Set up the mock to return an empty array
    mockDb.mockQueryResult = [];
    
    const result = await getLoggedInUseriMessageHandle(mockDb as unknown as Database);
    
    expect(result).toBe('no chat handle! [1]');
  });
  
  test('should return error message when no account login', async () => {
    // Set up the mock to return a row without account_login
    mockDb.mockQueryResult = [{ some_other_field: 'value' }];
    
    const result = await getLoggedInUseriMessageHandle(mockDb as unknown as Database);
    
    expect(result).toBe('no chat handle! [2]');
  });
  
  test('should handle database errors', async () => {
    // Set up the mock to throw an error
    mockDb.mockError = new Error('Database error');
    
    await expect(getLoggedInUseriMessageHandle(mockDb as unknown as Database))
      .rejects.toThrow('Failed to get iMessage handle: Database error');
  });
}); 