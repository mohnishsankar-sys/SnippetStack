const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/snippetstack';
    
    mongoose.connection.on('connected', () => {
      console.log(`[MongoDB] Connected successfully to: ${mongoose.connection.host}:${mongoose.connection.port}/${mongoose.connection.name}`);
    });

    mongoose.connection.on('error', (err) => {
      console.error(`[MongoDB] Connection error:`, err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn(`[MongoDB] Disconnected from database.`);
    });

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    return conn;
  } catch (error) {
    console.error(`[MongoDB] Initial connection failure: ${error.message}`);
    console.error(`[MongoDB] Troubleshooting tips:
    1. Ensure MongoDB Community Server is installed and running (run 'net start MongoDB' in Windows Admin cmd or start the service via services.msc).
    2. Check that port 27017 is open and listening.
    3. Verify the MONGODB_URI in server/.env is correct.`);
    throw error;
  }
};

module.exports = connectDB;
