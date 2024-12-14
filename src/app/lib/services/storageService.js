import { openDB } from 'idb';

const DB_NAME = 'appOfflineDB';
const DB_VERSION = 1;
const STORES = {
  TODOS: 'todos',
  USERS: 'users',
  // Add more stores as needed
};

class DatabaseService {
  constructor() {
    if (typeof window !== 'undefined') { // Ensure it's running in the browser
      this.dbPromise = openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          Object.values(STORES).forEach((storeName) => {
            if (!db.objectStoreNames.contains(storeName)) {
              const store = db.createObjectStore(storeName, { keyPath: 'id' });
              switch (storeName) {
                case 'todos':
                  store.createIndex('Completed', 'Completed', { unique: false });
                  store.createIndex('synced', 'synced', { unique: false });
                  break;
                case 'users':
                  store.createIndex('email', 'Email', { unique: true });
                  break;
                // Add additional case blocks for new stores
                default:
                  break;
              }
            }
          });
        },
      });
    }
  }

  async getStore(storeName, mode = 'readonly') {
    if (!this.dbPromise) {
      throw new Error('Database is not initialized');
    }
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

  // Bulk Update Method - For syncing data from server
  async bulkUpdate(storeName, items) {
    try {
      const store = await this.getStore(storeName, 'readwrite');
      for (const item of items) {
        await store.put({
          ...item,
          synced: 1, // Mark as synced
        });
      }
      console.log(`Bulk updated ${items.length} items in ${storeName}`);
      return {
        returncode: 200,
        message: `Bulk updated ${items.length} items in ${storeName}`,
        output: [],
      };
    } catch (error) {
      console.error(`Error bulk updating ${storeName}:`, error);
      return {
        returncode: 500,
        message: error.message,
        output: [],
      };
    }
  }

  // Add any additional generic methods as needed
}

const storageService = new DatabaseService();
export default storageService; 
