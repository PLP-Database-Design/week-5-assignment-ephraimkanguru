// Load environment variables from .env file
require('dotenv').config(); 
const mysql = require('mysql2'); 
const express = require('express'); 
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs'); 

// Serve static files from the "public" directory (optional)
app.use(express.static('public')); 

// Database connection setup
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to the database.');
});

app.use(express.json());

// Route to retrieve all patients and render patients.ejs
app.get('/patients', (req, res) => {
  connection.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, results) => {
    if (err) {
      console.error('Database query failed:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.render('patients', { patients: results }); // Render patients.ejs with the patient data
  });
});

// Route to retrieve all providers and render providers.ejs
app.get('/providers', (req, res) => {
  connection.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, results) => {
    if (err) {
      console.error('Database query failed:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.render('providers', { providers: results }); // Render providers.ejs with the provider data
  });
});

// Route to filter providers by specialty and render providers.ejs
app.get('/providers/filter', (req, res) => {
  const specialty = req.query.specialty; // Get specialty from query parameters
  connection.query('SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?', [specialty], (err, results) => {
    if (err) {
      console.error('Database query failed:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.render('providers', { providers: results, specialty }); // Render providers.ejs with filtered results and specialty
  });
});

// Route to retrieve all patients and render getPatients.ejs
app.get('/getPatients', (req, res) => {
  connection.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, results) => {
    if (err) {
      console.error('Database query failed:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.render('getPatients', { patients: results }); // Render getPatients.ejs with patient data
  });
});

// Route to render specialty.ejs
app.get('/specialty', (req, res) => {
  res.render('specialty'); // Render specialty.ejs
});

// Ensure PORT is declared only once
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
