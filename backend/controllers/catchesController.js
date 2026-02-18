const db = require('../database/db');

const catchesController = {
  getAllCatches: async (req, res) => {
    try {
      const catches = await db.catches.findAll();
      res.json(catches);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getCatchById: async (req, res) => {
    try {
      const catch_ = await db.catches.findById(req.params.id);
      if (!catch_) {
        return res.status(404).json({ error: 'Captura não encontrada' });
      }
      res.json(catch_);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createCatch: async (req, res) => {
    try {
      const newCatch = await db.catches.create(req.body);
      res.status(201).json(newCatch);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateCatch: async (req, res) => {
    try {
      const updated = await db.catches.update(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Captura não encontrada' });
      }
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteCatch: async (req, res) => {
    try {
      const deleted = await db.catches.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Captura não encontrada' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = catchesController;
