import dbService from '../services/storageService';

class TodosCrud {
  constructor() {
    this.storeName = 'todos';
  }

  async getCompletedTodos() {
    try {
      return await dbService.getByFilter(this.storeName, 'Completed', true);
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: [],
      };
    }
  }

  async getUncompletedTodos() {
    try {
      return await dbService.getByFilter(this.storeName, 'Completed', false);
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: [],
      };
    }
  }

  async createTodo({ title, description }) {
    try {
      return await dbService.add(this.storeName, { Title: title, Description: description });
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: [],
      };
    }
  }

  async updateTodo({ todo_id, title, description }) {
    try {
      return await dbService.update(this.storeName, todo_id, { Title: title, Description: description });
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: [],
      };
    }
  }

  async completeTodo({ todo_id }) {
    try {
      return await dbService.update(this.storeName, todo_id, { Completed: true });
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: [],
      };
    }
  }

  async deleteTodo({ todo_id }) {
    try {
      return await dbService.delete(this.storeName, todo_id);
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
