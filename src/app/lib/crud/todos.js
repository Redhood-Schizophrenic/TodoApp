import { BaseCrud } from './BaseCrud';
import Todos from '../models/Todos';
import todosOfflineCrud from '../offline_crud/todos';
import syncService from '../services/syncService';

class TodosCrud extends BaseCrud {
  constructor() {
    super(Todos);
  }

  async getCompletedTodos() {
    try {
      if (!syncService.isOnline) {
        return await todosOfflineCrud.getCompletedTodos();
      }
      return await this.readMany({
        Completed: true
      });
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: []
      };
    }
  }

  async getUncompletedTodos() {
    try {
      if (!syncService.isOnline) {
        return await todosOfflineCrud.getUncompletedTodos();
      }
      return await this.readMany({
        Completed: false
      });
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: []
      };
    }
  }

  async createTodo({ title, description }) {
    try {
      if (!syncService.isOnline) {
        return await todosOfflineCrud.createTodo({ title, description });
      }
      const result = await this.create({
        Title: title,
        Description: description,
      });
      return result;
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: []
      };
    }
  }

  async updateTodo({ todo_id, title, description }) {
    try {
      return await this.update(
        { _id: todo_id },
        { Title: title, Description: description }
      );
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: []
      };
    }
  }

  async completeTodo({ todo_id }) {
    try {
      return await this.update(
        { _id: todo_id },
        { Completed: true }
      );
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: []
      };
    }
  }

  async deleteTodo({ todo_id }) {
    try {
      return await this.delete({ _id: todo_id });
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: []
      };
    }
  }
}

const todosCrud = new TodosCrud();
export default todosCrud;
