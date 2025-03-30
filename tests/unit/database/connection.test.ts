import { Database } from '../../../src/utils/database';
import { test, expect, describe, beforeEach, afterEach, mock } from 'bun:test';

// Mock sqlite3
mock.module('sqlite3', () => ({
  verbose: () => ({
    Database: class MockDB {
      constructor(path: string) {}
      
      all(sql: string, params: any[], callback: (err: Error | null, rows: any[]) => void) {
        // Return a mock result with a value for the SQL query
        if (sql === 'SELECT 1') {
          callback(null, [{ '1': 1 }]);
        } else {
          callback(null, []);
        }
      }
      
      run(sql: string, params: any[], callback: (err: Error | null) => void) {
        callback(null);
      }
      
      close(callback: (err: Error | null) => void) {
        callback(null);
      }
    }
  })
}));

describe('Database Connection', () => {
  let db: Database;
  
  beforeEach(() => {
    db = new Database(':memory:');
  });
  
  afterEach(async () => {
    await db.close();
  });
  
  test('should construct without errors', () => {
    expect(db).toBeInstanceOf(Database);
  });
  
  test('should perform query operations', async () => {
    const result = await db.query('SELECT 1');
    expect(result).toEqual([{ '1': 1 }]);
  });
  
  test('should handle query errors', async () => {
    // Create a custom mock function for the all method
    const originalAll = db['db'].all;
    
    // Replace the all method with a custom implementation
    // @ts-ignore - Ignoring type issues for the test mock
    db['db'].all = (sql: string, params: any[], callback: (err: Error | null, rows: any[]) => void) => {
      callback(new Error('Database error'), []);
    };
    
    try {
      await expect(db.query('SELECT 1')).rejects.toThrow('Database error');
    } finally {
      // Restore the original method
      db['db'].all = originalAll;
    }
  });
}); 