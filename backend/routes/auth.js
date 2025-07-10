const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const mailer = require('../mailer');
const router = express.Router();
require('dotenv').config();

function isStrongPassword(pw) {
  return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(pw);
}

// Registration with email verification
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!isStrongPassword(password)) return res.status(400).send('Weak password');
  const hash = bcrypt.hashSync(password, 8);
  db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hash], (err, result) => {
    if (err) return res.status(400).send('User exists');
    const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '1d' });
    mailer.sendMail(email, "Verify your account", `<a href="http://localhost:5000/api/auth/verify/${token}">Verify</a>`);
    db.query('INSERT INTO logs (user_id, action) VALUES (?, ?)', [result.insertId, 'register']);
    res.send('Registration successful. Check your email.');
  });
});

// Email verification
router.get('/verify/:token', (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    db.query('UPDATE users SET verified=1 WHERE id=?', [decoded.id], () => {});
    db.query('INSERT INTO logs (user_id, action) VALUES (?, ?)', [decoded.id, 'verify']);
    res.send('Email verified! You can now login.');
  } catch {
    res.status(400).send('Invalid or expired token');
  }
});

// Login with account lockout and MFA
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username=?', [username], (err, results) => {
    if (err || results.length === 0) return res.status(400).send('User not found');
    const user = results[0];
    if (!user.verified) return res.status(403).send('Verify your email first');
    if (user.locked_until && new Date(user.locked_until) > new Date()) return res.status(403).send('Account locked. Try later.');
    if (!bcrypt.compareSync(password, user.password)) {
      db.query('UPDATE users SET failed_attempts=failed_attempts+1 WHERE id=?', [user.id]);
      if (user.failed_attempts + 1 >= 5) {
        const lockTime = new Date(Date.now() + 15*60*1000);
        db.query('UPDATE users SET locked_until=? WHERE id=?', [lockTime, user.id]);
      }
      db.query('INSERT INTO logs (user_id, action) VALUES (?, ?)', [user.id, 'login_failed']);
      return res.status(400).send('Wrong password');
    }
    // MFA step
    const mfaCode = Math.floor(100000 + Math.random() * 900000).toString();
    db.query('UPDATE users SET mfa_code=? WHERE id=?', [mfaCode, user.id]);
    mailer.sendMail(user.email, "Your MFA Code", `Your code: ${mfaCode}`);
    res.json({ mfa: true, userId: user.id });
  });
});

// MFA verification
router.post('/mfa', (req, res) => {
  const { userId, code } = req.body;
  db.query('SELECT * FROM users WHERE id=?', [userId], (err, results) => {
    if (err || results.length === 0) return res.status(400).send('User not found');
    const user = results[0];
    if (user.mfa_code !== code) return res.status(400).send('Invalid code');
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    db.query('UPDATE users SET mfa_code=NULL WHERE id=?', [user.id]);
    db.query('INSERT INTO logs (user_id, action) VALUES (?, ?)', [user.id, 'login']);
    res.json({ token });
  });
});

// Password reset request
router.post('/forgot', (req, res) => {
  const { email } = req.body;
  db.query('SELECT * FROM users WHERE email=?', [email], (err, results) => {
    if (err || results.length === 0) return res.status(400).send('No user');
    const user = results[0];
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    db.query('INSERT INTO reset_tokens (user_id, token, expires) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))', [user.id, token]);
    mailer.sendMail(email, "Reset Password", `<a href="http://localhost:3000/reset/${token}">Reset Password</a>`);
    db.query('INSERT INTO logs (user_id, action) VALUES (?, ?)', [user.id, 'reset_requested']);
    res.send('Check your email for reset link');
  });
});

// Password reset actual
router.post('/reset/:token', (req, res) => {
  const { password } = req.body;
  if (!isStrongPassword(password)) return res.status(400).send('Weak password');
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    db.query('SELECT * FROM reset_tokens WHERE token=? AND expires > NOW()', [req.params.token], (err, results) => {
      if (err || results.length === 0) return res.status(400).send('Invalid or expired token');
      const hash = bcrypt.hashSync(password, 8);
      db.query('UPDATE users SET password=? WHERE id=?', [hash, decoded.id]);
      db.query('DELETE FROM reset_tokens WHERE token=?', [req.params.token]);
      db.query('INSERT INTO logs (user_id, action) VALUES (?, ?)', [decoded.id, 'reset_done']);
      res.send('Password reset successful.');
    });
  } catch {
    res.status(400).send('Invalid or expired token');
  }
});

module.exports = router;