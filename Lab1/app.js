import express from 'express'
import session from 'express-session';
import configRoutes from './routes/index.js';
import { logRequests, countRequests } from './middleware/auth.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session init
app.use(session({
    name: 'RecipeSesh',
    secret: 'recipe-dev-secret',
    resave: false,
    saveUninitialized: false
}));

// middleware
app.use(logRequests);
app.use(countRequests);

//routes
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});