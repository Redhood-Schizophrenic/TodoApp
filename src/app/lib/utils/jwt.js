import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In production, always use environment variable
const JWT_EXPIRES_IN = '24h';

export const createToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const updateToken = (token, newData) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const updatedPayload = { ...decoded, ...newData };
    // Remove the exp claim to generate a fresh expiration
    delete updatedPayload.exp;
    return jwt.sign(updatedPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  } catch (error) {
    return null;
  }
};

export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};
