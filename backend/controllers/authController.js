const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || String(password).length < 6) {
      return res.status(400).json({
        code: 'MISSING_FIELDS',
        message: 'Name, email and a password of at least 6 characters are required',
      });
    }

    const exists = await User.findOne({ email: String(email).toLowerCase() });
    if (exists) {
      return res.status(409).json({ code: 'EMAIL_EXISTS', message: 'Email is already registered' });
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({ token: signToken(user._id), user: user.toPublic() });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ code: 'MISSING_FIELDS', message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(String(password)))) {
      return res.status(401).json({ code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' });
    }

    res.json({ token: signToken(user._id), user: user.toPublic() });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
