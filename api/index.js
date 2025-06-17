const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { parse } = require('csv-parse');

const app = express();

// Remove the PORT constant and app.listen() call.
// Vercel handles the server and port automatically.

//enable cors
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/', (req, res) => {
  res.send({ msg: 'Hello World' });
});

app.get('/about', (req, res) => {
  res.send('About route 🎉 ');
});

// Endpoint to read CSV and return JSON
app.get('/data', (req, res) => {
  const results = [];

  // Read and parse the CSV file
  fs.createReadStream('Annual_Surface_Temperature_Change.csv')
    .pipe(parse({ columns: true, trim: true }))
    .on('data', (row) => {
      results.push(row);
    })
    .on('end', () => {
      res.json(results[1]);
    })
    .on('error', (error) => {
      res.status(500).json({ error: 'Failed to read CSV file', details: error.message });
    });
});

// IMPORTANT: Export the Express app instance
module.exports = app;