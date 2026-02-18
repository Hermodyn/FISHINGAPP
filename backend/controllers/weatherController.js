const db = require('../database/db');

const weatherController = {
  getCurrentWeather: async (req, res) => {
    try {
      const weather = await db.weather.getCurrent();
      res.json(weather);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getForecast: async (req, res) => {
    try {
      const forecast = await db.weather.getForecast();
      res.json(forecast);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = weatherController;
