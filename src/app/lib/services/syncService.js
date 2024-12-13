import todosCrud from '../crud/todos';
import usersCrud from '../crud/users';
import storageService from './storageService';
import connectDB from './mongoConnection';

class SyncService {
  constructor() {
    this.isOnline = true;
    this.syncInterval = null;
    this.debugMode = false;
    connectDB();
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

      // Sync Todos
      const { output: unsyncedTodos } = await storageService.getByFilter('todos', 'synced', 0);
      for (const todo of unsyncedTodos) {
        if (todo.Completed) {
          await todosCrud.completeTodo({ todo_id: todo.id });
        } else {
          await todosCrud.createTodo({
            title: todo.Title,
            description: todo.Description
          });
        }
        await storageService.update('todos', todo.id, { synced: 1 });
      }

      // Sync Users
      const { output: unsyncedUsers } = await storageService.getByFilter('users', 'synced', 0);
      for (const user of unsyncedUsers) {
        // Implement synchronization logic for users
        await usersCrud.createUser({
          email: user.email,
          password: user.password
        });
        await storageService.update('users', user.id, { synced: 1 });
      }

      console.log('Sync completed successfully');
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
}

export default new SyncService(); 
