import { BaseCrud } from "./BaseCrud";
import Users from "../models/Users";
import { comparePassword } from "../utils/password";

class UsersCrud extends BaseCrud {
  constructor() {
    super(Users);
  }

  async registerUser({ email, password }) {
    try {
      const normalizedData = {
        Email: email,
        Password: password
      }
      const result = await this.create(normalizedData);
      return result;
    } catch (error) {
      return {
        returncode: 500,
        message: error.message,
        output: []
      }
    }
  }

  async loginUser({ email, password }) {
    try {
      const result = await this.readOne({ Email: email });

      // Verify password
      const isValid = await comparePassword(password, result.output.Password, result.output.SaltPassword);

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

const usersCrud = new UsersCrud();
export default usersCrud
