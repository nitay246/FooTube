import jwt from 'jsonwebtoken';
import { User } from './models/users.js'; // Ensure this path is correct for your project
const secret = process.env.JWT_SECRET || 'redacted'; // Use environment variable for production

// Generate JWT token
export function generateToken(user) {
  return jwt.sign({ id: user._id, username: user.username }, secret, { expiresIn: '1h' });
}

// Verify JWT token
export async function verifyToken(req, res, next) {
  const authHeader = req.header('Authorization');
  console.log('Authorization Header:', authHeader); // Debugging line
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.replace('Bearer ', '');
  console.log('Extracted Token:', token); // Debugging line

  try {
    const decoded = jwt.verify(token, secret); // Use your JWT secret
    console.log('Decoded Token:', decoded); // Debugging line
    const user = await User.findById(decoded.id);
    console.log('User from token:', user); // Debugging line
    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    console.log('req.user set:', req.user); // Debugging line
    next();
  } catch (error) {
    console.error('Token verification error:', error); // Debugging line
    res.status(401).json({ error: 'Invalid token' });
  }
}
