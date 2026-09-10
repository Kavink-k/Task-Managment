const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
  })
);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    system: 'TaskFlow API Server',
    timestamp: new Date().toISOString()
  });
});

// 404 Route handler for undefined API routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found`
  });
});

// Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start Server AFTER Database is fully connected
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`[TaskFlow Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n===============================================================`);
        console.error(`[Port Busy Error]: Port ${PORT} is already in use.`);
        console.error(`Another Node process is already running on port ${PORT}.`);
        console.error(`To fix: Close other open terminal tabs/processes running port ${PORT}.`);
        console.error(`===============================================================\n`);
        process.exit(1);
      }
    });
  } catch (err) {
    console.error('[TaskFlow Server Failure]:', err.message);
    process.exit(1);
  }
};

startServer();
