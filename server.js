// Load environment variables from .env file
require('dotenv').config(); 
const mysql = require('mysql2'); // Import mysql2 library for database connections
const express = require('express'); // Import express framework for building the API
const app = express(); // Create an instance of the express application

// Database connection setup using credentials from environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST, // Database host
  user: process.env.DB_USERNAME, // Database username
  password: process.env.DB_PASSWORD, // Database password
  database: process.env.DB_NAME, // Database name
});

// Test the database connection and log the result
connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err); // Log error if connection fails
    return;
  }
  console.log('Connected to the database.'); // Log success message if connection is established
});

// Middleware to parse JSON requests
app.use(express.json()); // Enable express to parse incoming JSON requests

// Route to retrieve all patients
app.get('/patients', (req, res) => {
  connection.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, results) => {
    if (err) {
      console.error('Database query failed:', err); // Log error if query fails
      return res.status(500).json({ error: 'Database query failed' }); // Send error response
    }
    res.json(results); // Send the results back as a JSON response
  });
});

// Route to retrieve all providers
app.get('/providers', (req, res) => {
  connection.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, results) => {
    if (err) {
      console.error('Database query failed:', err); // Log error if query fails
      return res.status(500).json({ error: 'Database query failed' }); // Send error response
    }
    res.json(results); // Send the results back as a JSON response
  });
});

// Route to filter providers by specialty
app.get('/providers/filter', (req, res) => {
  const specialty = req.query.specialty; // Get specialty from query parameters
  connection.query('SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?', [specialty], (err, results) => {
    if (err) {
      console.error('Database query failed:', err); // Log error if query fails
      return res.status(500).json({ error: 'Database query failed' }); // Send error response
    }
    res.json(results); // Send the filtered results back as a JSON response
  });
});

// Ensure PORT is declared only once
const PORT = process.env.PORT || 3000; // Use the port from environment variable or default to 3000

// Start the server and log the running status
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`); // Log the server URL
});
