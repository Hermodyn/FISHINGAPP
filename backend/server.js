const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('js-yaml');
const fs = require('fs');
const path = require('path');
const catchesRouter = require('./routes/catches');
const spotsRouter = require('./routes/spots');
const weatherRouter = require('./routes/weather');
const tidesRouter = require('./routes/tides');

const app = express();
const PORT = process.env.PORT || 3001;
 const NODE_ENV = process.env.NODE_ENV || 'development';

// Load OpenAPI spec
const openApiPath = path.join(__dirname, '../docs/openapi.yaml');
const openApiSpec = YAML.load(fs.readFileSync(openApiPath, 'utf8'));

// Middleware
const corsOriginEnv = process.env.CORS_ORIGIN;
const corsOrigins = corsOriginEnv
  ? corsOriginEnv.split(',').map((s) => s.trim()).filter(Boolean)
  : null;

app.use(cors({
  origin: (origin, callback) => {
    if (!corsOrigins) return callback(null, true);
    if (!origin) return callback(null, true);
    if (corsOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  }
}));
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Fishing App API Docs'
}));

// Routes
app.use('/api/catches', catchesRouter);
app.use('/api/spots', spotsRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/tides', tidesRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Debug endpoint - visualizar todo o banco de dados
app.get('/debug/database', async (req, res) => {
  if (NODE_ENV === 'production') {
    const token = process.env.DEBUG_TOKEN;
    const provided = req.get('x-debug-token');
    if (!token || provided !== token) {
      return res.status(404).json({ error: 'Not found' });
    }
  }

  const db = require('./database/db');
  const catches = await db.catches.findAll();
  const spots = await db.spots.findAll();
  const weather = await db.weather.getCurrent();
  
  res.json({
    database: 'in-memory',
    timestamp: new Date().toISOString(),
    data: {
      catches: {
        count: catches.length,
        items: catches
      },
      spots: {
        count: spots.length,
        items: spots
      },
      weather: weather
    }
  });
});

const server = app.listen(PORT, () => {
  console.log(`🎣 Backend server running on port ${PORT}`);
  console.log(`📚 API Docs available at http://localhost:${PORT}/api-docs`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`⚠️  Port ${PORT} is in use, trying ${PORT + 1}...`);
    app.listen(PORT + 1, () => {
      console.log(`🎣 Backend server running on port ${PORT + 1}`);
      console.log(`📚 API Docs available at http://localhost:${PORT + 1}/api-docs`);
    });
  } else {
    console.error('Server error:', err);
  }
});

module.exports = app;
