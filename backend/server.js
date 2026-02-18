const express = require('express');
const cors = require('cors');
const catchesRouter = require('./routes/catches');
const spotsRouter = require('./routes/spots');
const weatherRouter = require('./routes/weather');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/catches', catchesRouter);
app.use('/api/spots', spotsRouter);
app.use('/api/weather', weatherRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🎣 Backend server running on port ${PORT}`);
});

module.exports = app;
