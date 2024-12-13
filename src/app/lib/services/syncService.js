import todosCrud from '../crud/todos';
import storageService from './storageService';

class SyncService {
  constructor() {
    this.isOnline = true;
    this.syncInterval = null;
    this.debugMode = false;
  }

  initialize() {
    // Monitor online/offline status
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleOnline());
      window.addEventListener('offline', () => this.handleOffline());
      this.isOnline = this.debugMode ? false : navigator.onLine;
    }
  }

  setDebugMode(enabled) {
    this.debugMode = enabled;
    this.isOnline = enabled ? false : navigator.onLine;
    console.log(`Debug mode ${enabled ? 'enabled' : 'disabled'}, isOnline: ${this.isOnline}`);
  }

  toggleConnection() {
    this.isOnline = !this.isOnline;
    if (this.isOnline) {
      this.handleOnline();
    } else {
      this.handleOffline();
    }
    console.log(`Connection manually toggled to: ${this.isOnline ? 'online' : 'offline'}`);
  }

  async handleOnline() {
    this.isOnline = true;
    console.log('Connection status: Online');
    await this.syncWithServer();
  }

  handleOffline() {
    this.isOnline = false;
    console.log('Connection status: Offline');
  }

  async syncWithServer() {
    try {
      console.log('Starting sync with server...');
      const { output: unsyncedTodos } = await storageService.getUnsynced();
      console.log(`Found ${unsyncedTodos.length} unsynced todos`);

      for (const todo of unsyncedTodos) {
        console.log(`Syncing todo: ${todo.id}`);
        if (todo.Completed) {
          await todosCrud.completeTodo({ todo_id: todo.id });
        } else {
          await todosCrud.createTodo({
            title: todo.Title,
            description: todo.Description
          });
        }
        
        await storageService.markSynced(todo.id);
        console.log(`Todo ${todo.id} synced successfully`);
      }

      await storageService.clearSynced();
      console.log('Sync completed successfully');
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
}

const syncService = new SyncService();
export default syncService; 