const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

const router = express.Router();

// Rejestracja
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email i hasło są wymagane' });

  const hash = await bcrypt.hash(password, 10);

  const sql = 'INSERT INTO USERS (email, password_hash) VALUES (?, ?)';
  db.run(sql, [email, hash], function (err) {
    if (err) {
      return res.status(400).json({ message: 'Email zajęty?' });
    }
    return res.status(201).json({ userId: this.lastID });
  });
});

// Logowanie
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM USERS WHERE email = ?', [email], async (err, user) => {
    if (err || !user) return res.status(400).json({ message: 'Błędne dane' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(400).json({ message: 'Błędne dane' });

    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  });
});

// Wylogowanie 
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out (usun token w aplikacji)' });
});

module.exports = router;
