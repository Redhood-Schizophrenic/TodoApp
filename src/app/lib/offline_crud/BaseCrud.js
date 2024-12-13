import storageService from '../services/storageService';

export class BaseOfflineCrud {
  constructor(tableName) {
    this.tableName = tableName;
    this.db = storageService;
  }

  // Create a new record
  async create(data) {
    try {
      await this.db.initialize();
      const result = await this.db.run(
        `INSERT INTO ${this.tableName} (id, Title, Description, Completed, createdAt, updatedAt, synced)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          crypto.randomUUID(),
          data.Title,
          data.Description,
          data.Completed ? 1 : 0,
          new Date().toISOString(),
          new Date().toISOString(),
          0
        ]
      );

      return {
        returncode: 200,
        message: "Data Created Successfully (Offline)",
        output: result
      };
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: []
      };
    }
  }

  // Read all records with filters
  async readMany(filters = {}) {
    try {
      await this.db.initialize();
      let query = `SELECT * FROM ${this.tableName} WHERE 1=1`;
      const params = [];

      // Add filters to query
      Object.entries(filters).forEach(([key, value]) => {
        query += ` AND ${key} = ?`;
        params.push(value);
      });

      const results = await this.db.all(query, params);

      return {
        returncode: 200,
        message: "Data Fetched Successfully (Offline)",
        output: results
      };
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: []
      };
    }
  }

  // Update a record
  async update(filters = {}, data = {}) {
    try {
      await this.db.initialize();
      let query = `UPDATE ${this.tableName} SET `;
      const params = [];

      // Add update fields
      Object.entries(data).forEach(([key, value], index) => {
        query += `${key} = ?${index < Object.keys(data).length - 1 ? ',' : ''} `;
        params.push(value);
      });

      // Add synced = 0 to mark for sync
      query += ', synced = 0, updatedAt = ? WHERE 1=1';
      params.push(new Date().toISOString());

      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        query += ` AND ${key} = ?`;
        params.push(value);
      });

      const result = await this.db.run(query, params);

      return {
        returncode: 200,
        message: "Data Updated Successfully (Offline)",
        output: result
      };
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: []
      };
    }
  }

  // Delete a record
  async delete(filters = {}) {
    try {
      await this.db.initialize();
      let query = `DELETE FROM ${this.tableName} WHERE 1=1`;
      const params = [];

      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        query += ` AND ${key} = ?`;
        params.push(value);
      });

      const result = await this.db.run(query, params);

      return {
        returncode: 200,
        message: "Data Deleted Successfully (Offline)",
        output: result
      };
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: []
      };
    }
  }

  // Get unsynced records
  async getUnsynced() {
    try {
      await this.db.initialize();
      const results = await this.db.all(
        `SELECT * FROM ${this.tableName} WHERE synced = 0`
      );

      return {
        returncode: 200,
        message: "Unsynced Data Fetched Successfully",
        output: results
      };
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: []
      };
    }
  }

  // Mark record as synced
  async markSynced(id) {
    try {
      await this.db.initialize();
      await this.db.run(
        `UPDATE ${this.tableName} SET synced = 1 WHERE id = ?`,
        [id]
      );

      return {
        returncode: 200,
        message: "Record Marked as Synced",
        output: []
      };
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: []
      };
    }
  }
} 