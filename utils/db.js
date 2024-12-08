import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables from a `.env` file if available
dotenv.config();

class DBClient {
  constructor() {
    // MongoDB connection URL and database name
    this.url = `mongodb://${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 27017}`;
    this.dbName = process.env.DB_DATABASE || 'files_manager';
    this.client = new MongoClient(this.url, { useNewUrlParser: true, useUnifiedTopology: true });

    // Initialize connection
    this.connect();
  }

  async connect() {
    try {
      await this.client.connect();
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('MongoDB connection error:', err);
    }
  }

  /**
   * Checks if the MongoDB connection is alive
   * @return {boolean} true if connected, false otherwise
   */
  isAlive() {
    return this.client && this.client.topology && this.client.topology.isConnected();
  }

  /**
   * Returns the number of documents in the 'users' collection
   * @return {Promise<number>}
   */
  async nbUsers() {
    try {
      const db = this.client.db(this.dbName);
      return await db.collection('users').countDocuments();
    } catch (err) {
      console.error('Error counting users:', err);
      return 0; // Return 0 instead of throwing an error to prevent breaking the application
    }
  }

  /**
   * Returns the number of documents in the 'files' collection
   * @return {Promise<number>}
   */
  async nbFiles() {
    try {
      const db = this.client.db(this.dbName);
      return await db.collection('files').countDocuments();
    } catch (err) {
      console.error('Error counting files:', err);
      return 0; // Return 0 instead of throwing an error to prevent breaking the application
    }
  }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();
export default dbClient;