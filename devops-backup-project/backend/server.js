const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const startScheduler = require('./utils/scheduler');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',      require('./routes/authRoutes'));
app.use('/api/backups',   require('./routes/backupRoutes'));
app.use('/api/recovery',  require('./routes/recoveryRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

app.get('/', (req, res) => {
  res.json({ message: '🚀 DevOps Backup API is running!', status: 'OK' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  startScheduler();
});