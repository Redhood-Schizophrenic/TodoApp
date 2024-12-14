import dbService from '../lib/services/storageService';

export class BaseCrud {
  constructor(storeName) {
    this.storeName = storeName;
    this.db = dbService;
  }

  // Create a new record
  async create(data) {
    return await this.db.add(this.storeName, data);
  }

  // Read records with optional filters
  async read(filterKey, filterValue) {
    return await this.db.getByFilter(this.storeName, filterKey, filterValue);
  }

  // Update a record
  async update(id, data) {
    return await this.db.update(this.storeName, id, data);
  }

  // Delete a record
  async delete(id) {
    return await this.db.delete(this.storeName, id);
  }

  // Bulk update records (e.g., after syncing)
  async bulkUpdate(items) {
    return await this.db.bulkUpdate(this.storeName, items);
  }
} 
