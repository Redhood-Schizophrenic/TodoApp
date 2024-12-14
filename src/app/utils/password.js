import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hash a password with a generated salt
 * @param {string} password - Plain text password to hash
 * @returns {Promise<{hashedPassword: string, salt: string}>} - Hashed password and salt
 */
export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return { hashedPassword, salt };
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
};

/**
 * Compare a plain text password with a hashed password
 * @param {string} password - Plain text password to compare
 * @param {string} hashedPassword - Hashed password to compare against
 * @param {string} salt - Salt used in hashing
 * @returns {Promise<boolean>} - True if passwords match
 */
export const comparePassword = async (password, hashedPassword, salt) => {
  try {
    // Hash the input password with the stored salt
    const hashedInput = await bcrypt.hash(password, salt);
    // Compare the hashed input with the stored hash
    return hashedInput === hashedPassword;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw error;
  }
};
