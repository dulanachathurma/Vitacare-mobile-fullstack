const jwt = require('jsonwebtoken');
const User = require('../models/User');

const unauthorised = (res) =>
  res.status(401).json({ code: 'AUTH_REQUIRED', message: 'Not authorised, please log in' });

/** Verifies the Bearer token and attaches the user document to req.user. */
const protect = async (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return unauthorised(res);

  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return unauthorised(res);
    req.user = user;
    next();
  } catch (err) {
    return unauthorised(res);
  }
};

module.exports = { protect };
