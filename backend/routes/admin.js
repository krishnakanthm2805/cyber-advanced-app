const express = require('express');
const db = require('../db');
const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');
const router = express.Router();

router.get('/users', auth, rbac('admin'), (req, res) => {
  db.query('SELECT id, username, email, role, verified FROM users', (err, results) => {
    if (err) return res.status(500).send('Server error');
    res.json(results);
  });
});

router.get('/logs', auth, rbac('admin'), (req, res) => {
  db.query('SELECT * FROM logs', (err, results) => {
    if (err) return res.status(500).send('Server error');
    res.json(results);
  });
});

module.exports = router;