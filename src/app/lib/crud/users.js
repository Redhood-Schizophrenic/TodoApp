import Users from '../models/Users';
import bcrypt from 'bcryptjs';

class UsersCrud {
  constructor() { }

  // Register a new user in MongoDB
  async registerUser({ email, password }) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new Users({ Email: email, Password: hashedPassword });
      await newUser.save();
      return {
        returncode: 200,
        message: 'User created successfully',
        output: newUser,
      };
    } catch (error) {
      console.error('Error registering user:', error);
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
      const user = await Users.findOne({ Email: email });
      if (!user) {
        return {
          returncode: 404,
          message: 'User not found',
          output: [],
        };
      }

      // const isValid = await bcrypt.compare(password, user.Password);
      // if (!isValid) {
      //   return {
      //     returncode: 401,
      //     message: 'Invalid credentials',
      //     output: [],
      //   };
      // }

      return {
        returncode: 200,
        message: 'Login successful',
        output: [user],
      };
    } catch (error) {
      console.error('Error logging in user:', error);
      return {
        returncode: 500,
        message: error.message,
        output: [],
      };
    }
  }

  // Sync users from client to server
  async syncUsers(users) {
    try {
      for (const user of users) {
        const existingUser = await Users.findOne({ Email: user.Email });
        if (existingUser) {
          // Optionally update existing user
          existingUser.Password = user.Password; // Ensure password is hashed if needed
          await existingUser.save();
        } else {
          // Create new user
          const newUser = new Users({
            Email: user.Email,
            Password: user.Password, // Ensure password is hashed
          });
          await newUser.save();
        }
      }
      return { returncode: 200, message: 'Users synced successfully', output: [] };
    } catch (error) {
      console.error('Sync Users Error:', error);
      return { returncode: 500, message: error.message, output: [] };
    }
  }
}

const usersCrud = new UsersCrud();
export default usersCrud;
