/**
 * Database Configuration - MongoDB Atlas Connection
 * CS 409 Web Programming - UIUC Final Project
 * 
 * satisfies: database requirement
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer = null;

const shouldUseInMemoryDb = () => process.env.ALLOW_IN_MEMORY_DB !== 'false';

const startInMemoryServer = async () => {
  memoryServer = await MongoMemoryServer.create({
    instance: {
      dbName: process.env.IN_MEMORY_DB_NAME || 'recipeasy-demo',
    },
  });

  console.warn('⚠️  MONGODB_URI not set. Using in-memory MongoDB instance for demo purposes.');
  process.env.USE_IN_MEMORY_DB = 'true';

  return memoryServer.getUri();
};

const shutdownGracefully = async () => {
  try {
    await mongoose.connection.close();
    if (memoryServer) {
      await memoryServer.stop();
      console.log('🧹 In-memory MongoDB instance stopped');
    }
  } catch (shutdownError) {
    console.error('Error during MongoDB shutdown:', shutdownError);
  } finally {
    process.exit(0);
  }
};

const connectDB = async () => {
  try {
    let mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      if (!shouldUseInMemoryDb()) {
        console.error('❌ MONGODB_URI environment variable is not set and in-memory fallback is disabled');
        console.log('Please add MONGODB_URI to your .env file or enable ALLOW_IN_MEMORY_DB');
        process.exit(1);
      }

      mongoURI = await startInMemoryServer();
    }

    const conn = await mongoose.connect(mongoURI, {
      // These options are no longer needed in Mongoose 6+ but included for clarity
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    const connectionLabel = process.env.USE_IN_MEMORY_DB === 'true'
      ? `${conn.connection.host} (in-memory)`
      : conn.connection.host;

    console.log(`✅ MongoDB Connected: ${connectionLabel}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', shutdownGracefully);
    process.on('SIGTERM', shutdownGracefully);

  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    if (memoryServer) {
      await memoryServer.stop();
    }
    process.exit(1);
  }
};

module.exports = connectDB;

