require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Voting App API',
      version: '1.0.0',
      description: 'API for character voting microservice',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./server.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Supabase Initialization
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Returns the health check status
 *     responses:
 *       200:
 *         description: System is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                 uptime:
 *                   type: number
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'Healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * @swagger
 * /api/characters:
 *   get:
 *     summary: Returns the list of characters
 *     responses:
 *       200:
 *         description: List of characters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   image_url:
 *                     type: string
 *                   votes:
 *                     type: number
 */
app.get('/api/characters', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .order('votes', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/vote:
 *   post:
 *     summary: Increments vote for a character
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: Character UUID
 *     responses:
 *       200:
 *         description: Vote recorded successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
app.post('/api/vote', async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'Character ID is required' });

  try {
    const { data, error: fetchError } = await supabase
      .from('characters')
      .select('votes')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const { error: updateError } = await supabase
      .from('characters')
      .update({ votes: (data.votes || 0) + 1 })
      .eq('id', id);

    if (updateError) throw updateError;

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;

