const mongoose = require('mongoose');
const { seedCoreData } = require('../scripts/seed');
const User = require('../models/User');

let mongoMemoryServerInstance = null;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskflow';

  try {
    console.log(`[MongoDB] Attempting connection to ${mongoUri}...`);
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`[MongoDB] Connected to database: ${conn.connection.host}`);

    // Auto-seed if database has no users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[MongoDB] Fresh database detected. Seeding demo accounts...');
      await seedCoreData();
    }
  } catch (error) {
    console.warn(`[MongoDB Notice] Could not connect to '${mongoUri}' (${error.message}).`);
    console.log('[MongoDB Fallback] Starting embedded In-Memory MongoDB engine...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServerInstance = await MongoMemoryServer.create();
      const inMemoryUri = mongoMemoryServerInstance.getUri();

      await mongoose.connect(inMemoryUri);
      console.log(`[MongoDB Embedded] Connected to In-Memory MongoDB: ${inMemoryUri}`);

      // Auto-seed in-memory database
      await seedCoreData();
    } catch (fallbackErr) {
      console.error('[MongoDB Error] Unable to start fallback database:', fallbackErr.message);
      console.error('\nPlease ensure local MongoDB is running OR update MONGO_URI in server/.env.');
      process.exit(1);
    }
  }
};

module.exports = connectDB;
