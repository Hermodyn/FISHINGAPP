const db = require('../database/db');

function parseId(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

function pickSpotCreate(body) {
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const latitude = body?.latitude === '' || body?.latitude === null || body?.latitude === undefined ? undefined : Number(body.latitude);
  const longitude = body?.longitude === '' || body?.longitude === null || body?.longitude === undefined ? undefined : Number(body.longitude);
  const catches_count = body?.catches_count === '' || body?.catches_count === null || body?.catches_count === undefined ? undefined : Number(body.catches_count);
  const rating = body?.rating === '' || body?.rating === null || body?.rating === undefined ? undefined : Number(body.rating);

  return { name, latitude, longitude, catches_count, rating };
}

function pickSpotUpdate(body) {
  const out = {};
  if (typeof body?.name === 'string') out.name = body.name.trim();
  if (body?.latitude !== undefined) out.latitude = Number(body.latitude);
  if (body?.longitude !== undefined) out.longitude = Number(body.longitude);
  if (body?.catches_count !== undefined) out.catches_count = Number(body.catches_count);
  if (body?.rating !== undefined) out.rating = Number(body.rating);
  return out;
}

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
      const id = parseId(req.params.id);
      if (!id) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const spot = await db.spots.findById(id);
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
      const data = pickSpotCreate(req.body);
      if (!data.name) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
      }
      if (data.latitude !== undefined && !Number.isFinite(data.latitude)) {
        return res.status(400).json({ error: 'Latitude inválida' });
      }
      if (data.longitude !== undefined && !Number.isFinite(data.longitude)) {
        return res.status(400).json({ error: 'Longitude inválida' });
      }
      if (data.catches_count !== undefined && (!Number.isFinite(data.catches_count) || data.catches_count < 0)) {
        return res.status(400).json({ error: 'Quantidade de capturas inválida' });
      }
      if (data.rating !== undefined && (!Number.isFinite(data.rating) || data.rating < 0)) {
        return res.status(400).json({ error: 'Rating inválido' });
      }

      const newSpot = await db.spots.create(data);
      res.status(201).json(newSpot);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateSpot: async (req, res) => {
    try {
      const id = parseId(req.params.id);
      if (!id) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const data = pickSpotUpdate(req.body);
      if (data.latitude !== undefined && !Number.isFinite(data.latitude)) {
        return res.status(400).json({ error: 'Latitude inválida' });
      }
      if (data.longitude !== undefined && !Number.isFinite(data.longitude)) {
        return res.status(400).json({ error: 'Longitude inválida' });
      }
      if (data.catches_count !== undefined && (!Number.isFinite(data.catches_count) || data.catches_count < 0)) {
        return res.status(400).json({ error: 'Quantidade de capturas inválida' });
      }
      if (data.rating !== undefined && (!Number.isFinite(data.rating) || data.rating < 0)) {
        return res.status(400).json({ error: 'Rating inválido' });
      }

      const updated = await db.spots.update(id, data);
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
      const id = parseId(req.params.id);
      if (!id) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const deleted = await db.spots.delete(id);
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
