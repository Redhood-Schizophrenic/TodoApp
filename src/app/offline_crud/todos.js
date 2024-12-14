import { BaseCrud } from './BaseCrud';

class TodosCrud extends BaseCrud {
  constructor() {
    super('todos');
  }

  // Fetch completed todos
  async getCompletedTodos() {
    try {
      return await this.read('Completed', 1);
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: [],
      };
    }
  }

  // Fetch uncompleted todos
  async getUncompletedTodos() {
    try {
      return await this.read('Completed', 0);
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: [],
      };
    }
  }

  // Create a new todo
  async createTodo({ title, description }) {
    try {
      return await this.create({ Title: title, Description: description, Completed: 0 });
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: [],
      };
    }
  }

  // Complete a todo
  async completeTodo(todo_id) {
    try {
      return await this.update(todo_id, { Completed: 1 });
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: [],
      };
    }
  }

  // Delete a todo
  async deleteTodo(todo_id) {
    try {
      return await this.delete(todo_id);
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: [],
      };
    }
  }

  // Sync todos from server to IndexedDB
  async syncTodos(todos) {
    try {
      return await this.bulkUpdate(todos);
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: [],
      };
    }
  }
}

const todosCrud = new TodosCrud();
export default todosCrud; 
