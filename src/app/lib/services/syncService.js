import todosCrud from '../crud/todos';
import usersCrud from '../crud/users';

class SyncService {
  constructor() {}

  // Sync todos from client to server (MongoDB)
  async syncTodos(todos) {
    try {
      for (const todo of todos) {
        await todosCrud.createTodoFromSync(todo);
      }
      return { returncode: 200, message: 'Todos synced successfully', output: [] };
    } catch (error) {
      console.error('Sync Todos Error:', error);
      return { returncode: 500, message: error.message, output: [] };
    }
  }

  // Sync users from client to server (MongoDB)
  async syncUsers(users) {
    try {
      await usersCrud.syncUsers(users);
      return { returncode: 200, message: 'Users synced successfully', output: [] };
    } catch (error) {
      console.error('Sync Users Error:', error);
      return { returncode: 500, message: error.message, output: [] };
    }
  }
}

const syncService = new SyncService();
export default syncService; 
