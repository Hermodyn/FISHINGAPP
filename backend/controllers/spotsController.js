const db = require('../database/db');

const spotsController = {
  getAllSpots: async (req, res) => {
    try {
      const spots = await db.spots.findAll();
      res.json(spots);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getSpotById: async (req, res) => {
    try {
      const spot = await db.spots.findById(req.params.id);
      if (!spot) {
        return res.status(404).json({ error: 'Ponto não encontrado' });
      }
      res.json(spot);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createSpot: async (req, res) => {
    try {
      const newSpot = await db.spots.create(req.body);
      res.status(201).json(newSpot);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateSpot: async (req, res) => {
    try {
      const updated = await db.spots.update(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Ponto não encontrado' });
      }
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteSpot: async (req, res) => {
    try {
      const deleted = await db.spots.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Ponto não encontrado' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = spotsController;
