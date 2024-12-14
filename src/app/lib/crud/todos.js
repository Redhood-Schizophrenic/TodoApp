import Todos from '../models/Todos';

class TodosCrud {
  constructor() {}

  // Fetch completed todos from MongoDB
  async getCompletedTodos() {
    try {
      const completedTodos = await Todos.find({ Completed: true });
      return {
        returncode: 200,
        message: 'Completed todos fetched successfully',
        output: completedTodos,
      };
    } catch (error) {
      console.error('Error fetching completed todos:', error);
      return {
        returncode: 500,
        message: error.message,
        output: [],
      };
    }
  }

  // Fetch uncompleted todos from MongoDB
  async getUncompletedTodos() {
    try {
      const uncompletedTodos = await Todos.find({ Completed: false });
      return {
        returncode: 200,
        message: 'Uncompleted todos fetched successfully',
        output: uncompletedTodos,
      };
    } catch (error) {
      console.error('Error fetching uncompleted todos:', error);
      return {
        returncode: 500,
        message: error.message,
        output: [],
      };
    }
  }

  // Create a new todo in MongoDB
  async createTodo({ title, description }) {
    try {
      const newTodo = new Todos({ Title: title, Description: description });
      await newTodo.save();
      return {
        returncode: 200,
        message: 'Todo created successfully',
        output: newTodo,
      };
    } catch (error) {
      console.error('Error creating todo:', error);
      return {
        returncode: 500,
        message: error.message,
        output: [],
      };
    }
  }

  // Complete a todo in MongoDB
  async completeTodo({ todo_id }) {
    try {
      const updatedTodo = await Todos.findByIdAndUpdate(
        todo_id,
        { Completed: true },
        { new: true }
      );
      return {
        returncode: 200,
        message: 'Todo marked as completed',
        output: updatedTodo,
      };
    } catch (error) {
      console.error('Error completing todo:', error);
      return {
        returncode: 500,
        message: error.message,
        output: [],
      };
    }
  }

  // Delete a todo from MongoDB
  async deleteTodo({ todo_id }) {
    try {
      await Todos.findByIdAndDelete(todo_id);
      return {
        returncode: 200,
        message: 'Todo deleted successfully',
        output: [],
      };
    } catch (error) {
      console.error('Error deleting todo:', error);
      return {
        returncode: 500,
        message: error.message,
        output: [],
      };
    }
  }

  // Sync todo from client to server
  async createTodoFromSync(todo) {
    try {
      const existingTodo = await Todos.findOne({ _id: todo.id });

      if (existingTodo) {
        // Update existing todo
        const updatedTodo = await Todos.findByIdAndUpdate(
          todo.id,
          {
            Title: todo.Title,
            Description: todo.Description,
            Completed: todo.Completed,
            // Add other fields as necessary
          },
          { new: true }
        );
        return {
          returncode: 200,
          message: 'Todo updated successfully',
          output: updatedTodo,
        };
      } else {
        // Create new todo
        const newTodo = new Todos({
          _id: todo.id, // Use same ID from IndexedDB
          Title: todo.Title,
          Description: todo.Description,
          Completed: todo.Completed,
        });
        await newTodo.save();
        return {
          returncode: 200,
          message: 'Todo synced successfully',
          output: newTodo,
        };
      }
    } catch (error) {
      console.error('Error syncing todo:', error);
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
