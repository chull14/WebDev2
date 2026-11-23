# CS-554 Lab 6 — Workshop Registration System
 
A React frontend for the Lab 3 GraphQL server.
 
```
Lab6/
  server/   GraphQL server from Lab 3
  client/   React frontend
```

## 1. Install dependencies
 
```bash
cd server
npm install
 
cd ../client
npm install
```
 
## 2. Start MongoDB
  
```bash
# macOS (Homebrew)
brew services start mongodb-community
 
# or run it directly
mongod
```
 
The server uses the database `Hull-Connor-CS554-Lab3-graphql`.
 
## 3. Start the GraphQL server
 
```bash
cd server
npm start
```
 
The server runs at http://localhost:4000.
 
## 4. Start the React frontend
 
In a second terminal:
 
```bash
cd client
npm run dev
```
 
Open the URL Vite prints (usually http://localhost:5173).