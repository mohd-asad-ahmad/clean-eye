require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { Pool } = require('pg');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

// Set up Multer for handling file uploads (stored in memory for instant processing)
const upload = multer({ storage: multer.memoryStorage() });

// Connect to Supabase PostgreSQL Database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
// Test database connection on start
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
  } else {
    console.log('✅ Connected to Supabase PostGIS Database successfully!');
  }
});
// Initialize Google Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Basic Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is up and running!' });
});

// Main Reporting Endpoint (Receives image + latitude + longitude)
app.post('/api/report', upload.single('image'), async (req, res) => {
  try {
    const { latitude, longitude, user_message } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Please upload an image.' });
    }

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and Longitude are required.' });
    }

    // Prepare image for Gemini Vision API
    const imagePart = {
      inlineData: {
        data: req.file.buffer.toString('base64'),
        mimeType: req.file.mimetype,
      },
    };

    const prompt = `Analyze this image of reported municipal waste/garbage.
    Return a STRICT raw JSON response (without any markdown code block formatting) containing:
    {
      "waste_category": "e.g., Plastic/Organic/Construction Demolition/Hazardous/General Waste",
      "severity_score": An integer from 1 to 5 (1 being minor litter, 5 being critical hazardous accumulation),
      "estimated_volume": "e.g., 1-2 bags / 1 truckload / scattered debris",
      "assigned_department": "e.g., Sanitation / Public Works / Hazardous Waste Management"
    }`;

    // Query Gemini 2.5 Flash
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [prompt, imagePart],
    });

    // Parse the JSON returned by Gemini
    const cleanText = response.text.replace(/```json|```/g, '').trim();
    const aiData = JSON.parse(cleanText);

    // For local MVP, we use a placeholder image URL or Base64 string
    const imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Insert record into PostGIS database using ST_SetSRID and ST_MakePoint
    const query = `
      INSERT INTO waste_tickets 
        (image_url, user_message, location, waste_category, severity_score, estimated_volume, assigned_department, status)
      VALUES 
        ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326), $5, $6, $7, $8, 'OPEN')
      RETURNING id, status, waste_category, severity_score, ST_AsGeoJSON(location) as location;
    `;

    const values = [
      imageUrl,
      user_message || '',
      parseFloat(longitude),
      parseFloat(latitude),
      aiData.waste_category,
      aiData.severity_score,
      aiData.estimated_volume,
      aiData.assigned_department
    ];

    const dbResult = await pool.query(query, values);

    res.status(201).json({
      message: 'Ticket created successfully!',
      ticket: dbResult.rows[0],
      ai_analysis: aiData
    });

  } catch (error) {
    console.error('Error processing report:', error);
    res.status(500).json({ error: 'Failed to process report', details: error.message });
  }
});

// Endpoint for Municipal Dashboard to fetch map points
app.get('/api/tickets', async (req, res) => {
  try {
    const query = `
      SELECT 
        id, image_url, user_message, waste_category, severity_score, 
        estimated_volume, assigned_department, status, created_at,
        ST_X(location::geometry) AS longitude,
        ST_Y(location::geometry) AS latitude
      FROM waste_tickets
      ORDER BY created_at DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Endpoint for Municipal Officer to resolve a redspot into a greenspot
app.patch('/api/tickets/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `UPDATE waste_tickets SET status = 'RESOLVED' WHERE id = $1 RETURNING *;`;
    const result = await pool.query(query, [id]);
    res.json({ message: 'Ticket resolved successfully', ticket: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to resolve ticket' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Clean Eye Backend Server running on port ${PORT}`);
});