import { BaseOfflineCrud } from './BaseCrud';

class UsersOfflineCrud extends BaseOfflineCrud {
  constructor() {
    super('users');
  }

  async registerUser({ email, password }) {
    try {
      return await this.create({
        Email: email,
        Password: password
      });
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: []
      };
    }
  }

  async loginUser({ email, password }) {
    try {
      const result = await this.readMany({ Email: email });

      // Verify password
      const isValid = result.output[0].Password === password;

      if (!isValid) {
        return {
          returncode: 401,
          message: 'Invalid credentials',
          output: []
        };
      }

      // Return staff data with hotel information
      const userData = {
        user_info: result.output
      };

      return {
        returncode: 200,
        message: 'Login successful',
        output: [userData]
      };

    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: []
      }
    }
  }
}

const usersOfflineCrud = new UsersOfflineCrud();
export default usersOfflineCrud; 
