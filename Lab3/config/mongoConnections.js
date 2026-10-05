import { MongoClient } from 'mongodb';
import { mongoConfig } from './settings.js';

let connection = undefined;
let db = undefined;

const dbConnection = async () => {
  if (!connection) {
    connection = await MongoClient.connect(mongoConfig.serverUrl);
    db = connection.db(mongoConfig.database);
    console.log('Connected to MongoDB');
  }

  return db;
};
const closeConnection = async () => {
  await connection.close();
};

export { dbConnection, closeConnection };