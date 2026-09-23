import express from 'express';
import client from './config/client.js';
import 'dotenv/config';
import configRoutes from './routes/index.js';

try {
    await client.connect();
} catch (e) {
    throw err(500, 'Could not connect to Redis');
};

const app = express();

// routes
configRoutes(app);

// unknown route
app.use((req, res) => {
    return res.status(404).json({ error: 'Route not found' });
});


app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});

