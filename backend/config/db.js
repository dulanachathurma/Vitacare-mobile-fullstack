const mongoose = require('mongoose');

/**
 * Connects to MongoDB. Falls back to an in-memory server when MONGO_URI
 * is not provided, which makes local demos work with zero setup.
 */
const connectDB = async () => {
  let uri = process.env.MONGO_URI;

  if (!uri) {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri();
    console.log('No MONGO_URI set - using in-memory MongoDB (data resets on restart).');
  }

  const conn = await mongoose.connect(uri);
  console.log('MongoDB connected: ' + conn.connection.host);
};

module.exports = connectDB;
