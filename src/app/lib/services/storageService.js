class StorageService {
  constructor() {
    this.dbName = 'todosOfflineDB';
    this.storeName = 'todos';
    this.db = null;
    this.initialized = false;
  }

  async initialize() {
    if (!this.initialized) {
      console.log('Initializing IndexedDB...');
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, 1);

        request.onerror = () => {
          console.error('Failed to open IndexedDB:', request.error);
          reject(request.error);
        };

        request.onsuccess = () => {
          this.db = request.result;
          this.initialized = true;
          console.log('IndexedDB initialized successfully');
          resolve();
        };

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
            store.createIndex('Completed', 'Completed', { unique: false });
            store.createIndex('synced', 'synced', { unique: false });
          }
        };
      });
    }
  }

  async add(data) {
    await this.initialize();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);

      const todo = {
        id: crypto.randomUUID(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        synced: 0
      };

      const request = store.add(todo);

      request.onsuccess = () => {
        console.log('Todo added to IndexedDB:', todo);
        resolve({
          returncode: 200,
          message: "Data Created Successfully (Offline)",
          output: todo
        });
      };

      request.onerror = () => {
        console.error('Error adding todo:', request.error);
        reject({
          returncode: 500,
          message: request.error.message,
          output: []
        });
      };
    });
  }

  async getByFilter(filterKey, filterValue) {
    await this.initialize();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index(filterKey);
      const request = index.getAll(filterValue);

      request.onsuccess = () => {
        console.log(`Todos retrieved with ${filterKey}=${filterValue}:`, request.result);
        resolve({
          returncode: 200,
          message: "Data Fetched Successfully (Offline)",
          output: request.result
        });
      };

      request.onerror = () => {
        console.error('Error fetching todos:', request.error);
        reject({
          returncode: 500,
          message: request.error.message,
          output: []
        });
      };
    });
  }

  async update(id, data) {
    await this.initialize();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onsuccess = () => {
        const todo = request.result;
        if (todo) {
          const updatedTodo = {
            ...todo,
            ...data,
            updatedAt: new Date().toISOString(),
            synced: 0
          };
          const updateRequest = store.put(updatedTodo);

          updateRequest.onsuccess = () => {
            console.log('Todo updated:', updatedTodo);
            resolve({
              returncode: 200,
              message: "Data Updated Successfully (Offline)",
              output: updatedTodo
            });
          };

          updateRequest.onerror = () => {
            console.error('Error updating todo:', updateRequest.error);
            reject({
              returncode: 500,
              message: updateRequest.error.message,
              output: []
            });
          };
        } else {
          reject({
            returncode: 404,
            message: "Todo not found",
            output: []
          });
        }
      };
    });
  }

  async delete(id) {
    await this.initialize();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => {
        console.log('Todo deleted:', id);
        resolve({
          returncode: 200,
          message: "Data Deleted Successfully (Offline)",
          output: []
        });
      };

      request.onerror = () => {
        console.error('Error deleting todo:', request.error);
        reject({
          returncode: 500,
          message: request.error.message,
          output: []
        });
      };
    });
  }

  async getUnsynced() {
    return this.getByFilter('synced', 0);
  }

  async markSynced(id) {
    return this.update(id, { synced: 1 });
  }

  async clearSynced() {
    const { output: syncedTodos } = await this.getByFilter('synced', 1);
    for (const todo of syncedTodos) {
      await this.delete(todo.id);
    }
  }
}

const storageService = new StorageService();
export default storageService; 