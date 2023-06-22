const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017'; 
const dbName = 'mydatabase'; 

let db;

const connectDB = async () => {
  try {
    const client = await MongoClient.connect(url);
    db = client.db(dbName);

    // Create the "students" collection if it doesn't exist
    await db.createCollection('students');
    
    console.log('Connected to the database');
  } catch (err) {
    console.error('Failed to connect to the database:', err);
  }
};

const getDB = () => {
  return db;
};

module.exports = { connectDB, getDB };
