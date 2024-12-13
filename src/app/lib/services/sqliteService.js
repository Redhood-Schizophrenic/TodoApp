import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

class SQLiteService {
  constructor() {
    this.db = null;
    this.initialized = false;
  }

  async initialize() {
    if (!this.initialized) {
      console.log('Initializing SQLite database...');
      this.db = await open({
        filename: './todos.db',
        driver: sqlite3.Database
      });

      console.log('Creating tables if needed...');
      await this.db.exec(`
        CREATE TABLE IF NOT EXISTS todos (
          id TEXT PRIMARY KEY,
          Title TEXT NOT NULL,
          Description TEXT,
          Completed BOOLEAN DEFAULT 0,
          createdAt TEXT,
          updatedAt TEXT,
          synced BOOLEAN DEFAULT 0
        )
      `);

      this.initialized = true;
      console.log('SQLite initialization complete');
    }
  }

  async run(query, params) {
    console.log('Executing SQLite query:', query, 'with params:', params);
    const result = await this.db.run(query, params);
    console.log('Query result:', result);
    return result;
  }

  async all(query, params) {
    console.log('Executing SQLite query:', query, 'with params:', params);
    const results = await this.db.all(query, params);
    console.log('Query results:', results);
    return results;
  }
}

const sqliteService = new SQLiteService();
export default sqliteService; 
