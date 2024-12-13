import { BaseOfflineCrud } from './BaseCrud';

class TodosOfflineCrud extends BaseOfflineCrud {
  constructor() {
    super('todos');
  }

  async getCompletedTodos() {
    try {
      return await this.readMany({ Completed: 1 });
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
      return await this.readMany({ Completed: 0 });
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
      return await this.create({
        Title: title,
        Description: description,
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

  async completeTodo({ todo_id }) {
    try {
      return await this.update(
        { id: todo_id },
        { Completed: 1 }
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
      return await this.delete({ id: todo_id });
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: []
      };
    }
  }
}

const todosOfflineCrud = new TodosOfflineCrud();
export default todosOfflineCrud; 