import { openDB } from 'idb'; // Optional: Consider using the 'idb' library for better IndexedDB handling

const DB_NAME = 'todosOfflineDB';
const DB_VERSION = 1;

class DatabaseService {
  constructor() {
    this.dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('todos')) {
          const todosStore = db.createObjectStore('todos', { keyPath: 'id' });
          todosStore.createIndex('Completed', 'Completed', { unique: false });
          todosStore.createIndex('synced', 'synced', { unique: false });
        }

        if (!db.objectStoreNames.contains('users')) {
          const usersStore = db.createObjectStore('users', { keyPath: 'id' });
          usersStore.createIndex('email', 'email', { unique: true });
        }

        // Add additional stores(Tables) here as needed
      },
    });
  }

  async getStore(storeName, mode = 'readonly') {
    const db = await this.dbPromise;
    return db.transaction(storeName, mode).objectStore(storeName);
  }

  // Generic Add Method
  async add(storeName, data) {
    try {
      const store = await this.getStore(storeName, 'readwrite');
      const item = {
        id: crypto.randomUUID(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        synced: 0,
      };
      await store.add(item);
      console.log(`${storeName.slice(0, -1)} added to IndexedDB:`, item);
      return {
        returncode: 200,
        message: `${storeName.slice(0, -1)} Created Successfully (Offline)`,
        output: item,
      };
    } catch (error) {
      console.error(`Error adding ${storeName.slice(0, -1)}:`, error);
      return {
        returncode: 500,
        message: error.message,
        output: [],
      };
    }
  }

  // Generic Get by Filter Method
  async getByFilter(storeName, filterKey, filterValue) {
    try {
      const store = await this.getStore(storeName);
      const index = store.index(filterKey);
      const result = await index.getAll(filterValue);
      console.log(`Items retrieved from ${storeName} with ${filterKey}=${filterValue}:`, result);
      return {
        returncode: 200,
        message: `${storeName.slice(0, -1)} Fetched Successfully (Offline)`,
        output: result,
      };
    } catch (error) {
      console.error(`Error fetching from ${storeName}:`, error);
      return {
        returncode: 500,
        message: error.message,
        output: [],
      };
    }
  }

  // Generic Update Method
  async update(storeName, id, data) {
    try {
      const store = await this.getStore(storeName, 'readwrite');
      const item = await store.get(id);
      if (!item) {
        return {
          returncode: 404,
          message: `${storeName.slice(0, -1)} not found`,
          output: [],
        };
      }
      const updatedItem = {
        ...item,
        ...data,
        updatedAt: new Date().toISOString(),
        synced: 0,
      };
      await store.put(updatedItem);
      console.log(`${storeName.slice(0, -1)} updated:`, updatedItem);
      return {
        returncode: 200,
        message: `${storeName.slice(0, -1)} Updated Successfully (Offline)`,
        output: updatedItem,
      };
    } catch (error) {
      console.error(`Error updating ${storeName.slice(0, -1)}:`, error);
      return {
        returncode: 500,
        message: error.message,
        output: [],
      };
    }
  }

  // Generic Delete Method
  async delete(storeName, id) {
    try {
      const store = await this.getStore(storeName, 'readwrite');
      await store.delete(id);
      console.log(`${storeName.slice(0, -1)} deleted:`, id);
      return {
        returncode: 200,
        message: `${storeName.slice(0, -1)} Deleted Successfully (Offline)`,
        output: [],
      };
    } catch (error) {
      console.error(`Error deleting ${storeName.slice(0, -1)}:`, error);
      return {
        returncode: 500,
        message: error.message,
        output: [],
      };
    }
  }

  // Add any additional generic methods as needed
}

const dbService = new DatabaseService();
export default dbService; 
