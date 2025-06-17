const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { parse } = require('csv-parse');
const path = require('path');

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
// app.get('/data', (req, res) => {
//   const results = [];

//   // Read and parse the CSV file
//   fs.createReadStream('Annual_Surface_Temperature_Change.csv')
//     .pipe(parse({ columns: true, trim: true }))
//     .on('data', (row) => {
//       results.push(row);
//     })
//     .on('end', () => {
//       res.json(results[1]);
//     })
//     .on('error', (error) => {
//       res.status(500).json({ error: 'Failed to read CSV file', details: error.message });
//     });
// });


// Endpoint to read CSV and return JSON
app.get('/countries', (req, res) => {
  const results = [];
  const countries = [];
  // Use path.join and __dirname to get the correct absolute path
  const csvFilePath = path.join(__dirname, 'Annual_Surface_Temperature_Change.csv');

  // Read and parse the CSV file
  fs.createReadStream(csvFilePath) // Use the absolute path here
    .pipe(parse({ columns: true, trim: true }))
    .on('data', (row) => {
      results.push(row);
    })
    .on('end', () => {
      // Add a check to ensure results[1] exists
      if (results.length > 1) {
        results.forEach(data => {
          if(data.Country) {
            countries.push(data.Country);
          }
        });
        res.json(countries);
      } else {
        res.status(404).json({ error: 'Data not found or CSV has too few rows.' });
      }
    })
    .on('error', (error) => {
      console.error('CSV Read Error:', error); // Log the error for debugging
      res.status(500).json({ error: 'Failed to read CSV file', details: error.message });
    });
});

// Endpoint to read CSV and return JSON
app.get('/data', (req, res) => {
  console.log('req.params ', req.query.test);
  const country = req.query.country || 'India';
  const results = [];
  // Use path.join and __dirname to get the correct absolute path
  const csvFilePath = path.join(__dirname, 'Annual_Surface_Temperature_Change.csv');

  // Read and parse the CSV file
  fs.createReadStream(csvFilePath) // Use the absolute path here
    .pipe(parse({ columns: true, trim: true }))
    .on('data', (row) => {
      results.push(row);
    })
    .on('end', () => {
      // Add a check to ensure results[1] exists
      if (results.length > 1) {
        const countryResult = results.find(c => c.Country === country);
        const data = countryResult || results[0];
        res.json(data);

      } else {
        res.status(404).json({ error: 'Data not found or CSV has too few rows.' });
      }
    })
    .on('error', (error) => {
      console.error('CSV Read Error:', error); // Log the error for debugging
      res.status(500).json({ error: 'Failed to read CSV file', details: error.message });
    });
});



// IMPORTANT: Export the Express app instance
module.exports = app;