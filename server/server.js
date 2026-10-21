const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const snippetRoutes = require('./routes/snippetRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// CORS configuration to allow local frontend access
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, postman) or matching dev ports
      if (
        !origin ||
        origin === CLIENT_URL ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:')
      ) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev to avoid blocking local developer setups
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing middleware
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const isHealthy = dbState === 1;

  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    status: isHealthy ? 'OK' : 'DEGRADED',
    message: isHealthy
      ? 'SnippetStack backend and MongoDB database are healthy.'
      : 'Database connection is not ready.',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: {
      status: states[dbState] || 'unknown',
      name: mongoose.connection.name || 'snippetstack',
      host: mongoose.connection.host || '127.0.0.1',
      port: mongoose.connection.port || 27017,
    },
  });
});

// Snippet REST API Routes
app.use('/api/snippets', snippetRoutes);

// Fallback 404 for undefined endpoints
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found on this server.`,
  });
});

// Centralized error handling middleware
app.use(errorHandler);

// Connect to MongoDB and start Express server
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`  SnippetStack API Server running on port: ${PORT}`);
      console.log(`  Health Check: http://localhost:${PORT}/api/health`);
      console.log(`  Snippets API: http://localhost:${PORT}/api/snippets`);
      console.log(`  MongoDB Database: ${mongoose.connection.name || 'snippetstack'}`);
      console.log(`======================================================\n`);
    });

    // Graceful shutdown
    const gracefulShutdown = () => {
      console.log('\n[Server] Shutting down gracefully...');
      server.close(() => {
        mongoose.connection.close(false, () => {
          console.log('[Server] MongoDB connection closed.');
          process.exit(0);
        });
      });
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
  } catch (error) {
    console.error('[Server] Fatal startup error:', error.message);
    process.exit(1);
  }
};

startServer();
