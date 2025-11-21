const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization; // "Bearer token"
  if (!authHeader) return res.status(401).json({ message: 'Brak tokenu' });

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { userId, email }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Nieprawidłowy token' });
  }
}

module.exports = authMiddleware;
