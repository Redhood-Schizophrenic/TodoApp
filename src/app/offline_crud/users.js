import { BaseCrud } from './BaseCrud';

class UsersCrud extends BaseCrud {
  constructor() {
    super('users');
  }

  // Register a new user
  async registerUser({ email, password }) {
    try {
      return await this.create({ Email: email, Password: password });
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: [],
      };
    }
  }

  // Login a user
  async loginUser({ email, password }) {
    try {
      const result = await this.read('email', email);
      if (result.output.length === 0) {
        return {
          returncode: 404,
          message: 'User not found',
          output: [],
        };
      }

      const user = result.output[0];
      const isValid = user.Password === password; // Simplistic password check

      if (!isValid) {
        return {
          returncode: 401,
          message: 'Invalid credentials',
          output: [],
        };
      }

      return {
        returncode: 200,
        message: 'Login successful',
        output: [user],
      };
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: [],
      };
    }
  }

  // Sync users from server to IndexedDB
  async syncUsers(users) {
    try {
      return await this.bulkUpdate(users);
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: [],
      };
    }
  }
}

const usersCrud = new UsersCrud();
export default usersCrud; 
