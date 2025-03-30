import sqlite3 from 'sqlite3';
import { DatabaseRow } from '../types/database';

/**
 * Database class that wraps SQLite functionality
 */
export class Database {
  /**
   * The underlying SQLite database instance
   */
  private db: sqlite3.Database;
  
  /**
   * Creates a new Database instance
   * 
   * @param filePath Path to the SQLite database file
   */
  constructor(filePath: string) {
    const sqlite = sqlite3.verbose();
    this.db = new sqlite.Database(filePath);
  }
  
  /**
   * Executes a SQL query and returns the results
   * 
   * @param sql SQL query to execute
   * @param params Parameters for the SQL query
   * @returns Promise resolving to the query results
   */
  async query<T = DatabaseRow>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows as T[]);
      });
    });
  }
  
  /**
   * Executes a SQL statement that doesn't return results
   * 
   * @param sql SQL statement to execute
   * @param params Parameters for the SQL statement
   * @returns Promise resolving when the statement is executed
   */
  async exec(sql: string, params: any[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
  
  /**
   * Closes the database connection
   * 
   * @returns Promise resolving when the connection is closed
   */
  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
} 