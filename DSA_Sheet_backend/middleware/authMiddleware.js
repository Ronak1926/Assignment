import jwt from 'jsonwebtoken';
import User from '../model/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message:
        error.name === 'TokenExpiredError'
          ? 'Session expired'
          : 'Not authorized',
    });
  }
};
