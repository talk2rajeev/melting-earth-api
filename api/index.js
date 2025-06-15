const express = require('express');
const app = express();

// Remove the PORT constant and app.listen() call.
// Vercel handles the server and port automatically.

app.get('/', (req, res) => {
  res.send({ msg: 'Hello World' });
});

app.get('/about', (req, res) => {
  res.send('About route 🎉 ');
});

// IMPORTANT: Export the Express app instance
module.exports = app;