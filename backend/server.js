const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('js-yaml');
const fs = require('fs');
const path = require('path');
const catchesRouter = require('./routes/catches');
const spotsRouter = require('./routes/spots');
const weatherRouter = require('./routes/weather');

const app = express();
const PORT = process.env.PORT || 3001;

// Load OpenAPI spec
const openApiPath = path.join(__dirname, '../docs/openapi.yaml');
const openApiSpec = YAML.load(fs.readFileSync(openApiPath, 'utf8'));

// Middleware
app.use(cors());
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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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
