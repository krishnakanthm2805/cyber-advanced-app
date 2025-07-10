const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./db');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.listen(5000, () => console.log('Server running on http://localhost:5000'));