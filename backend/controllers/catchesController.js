const db = require('../database/db');

function parseId(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

function pickCatchCreate(body) {
  const species = typeof body?.species === 'string' ? body.species.trim() : '';
  const location = typeof body?.location === 'string' ? body.location.trim() : '';
  const weather = typeof body?.weather === 'string' ? body.weather.trim() : undefined;
  const baitUsed = typeof body?.baitUsed === 'string' ? body.baitUsed.trim() : undefined;

  const weight = body?.weight === '' || body?.weight === null || body?.weight === undefined ? undefined : Number(body.weight);
  const length = body?.length === '' || body?.length === null || body?.length === undefined ? undefined : Number(body.length);

  return { species, weight, length, location, weather, baitUsed };
}

function pickCatchUpdate(body) {
  const out = {};
  if (typeof body?.species === 'string') out.species = body.species.trim();
  if (body?.weight !== undefined) out.weight = Number(body.weight);
  if (body?.length !== undefined) out.length = Number(body.length);
  if (typeof body?.location === 'string') out.location = body.location.trim();
  if (typeof body?.weather === 'string') out.weather = body.weather.trim();
  if (typeof body?.baitUsed === 'string') out.baitUsed = body.baitUsed.trim();
  return out;
}

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
      const id = parseId(req.params.id);
      if (!id) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const catch_ = await db.catches.findById(id);
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
      const data = pickCatchCreate(req.body);
      if (!data.species) {
        return res.status(400).json({ error: 'Espécie é obrigatória' });
      }
      if (data.weight !== undefined && !Number.isFinite(data.weight)) {
        return res.status(400).json({ error: 'Peso inválido' });
      }
      if (data.length !== undefined && !Number.isFinite(data.length)) {
        return res.status(400).json({ error: 'Comprimento inválido' });
      }

      const newCatch = await db.catches.create(data);
      res.status(201).json(newCatch);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateCatch: async (req, res) => {
    try {
      const id = parseId(req.params.id);
      if (!id) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const data = pickCatchUpdate(req.body);
      if (data.weight !== undefined && !Number.isFinite(data.weight)) {
        return res.status(400).json({ error: 'Peso inválido' });
      }
      if (data.length !== undefined && !Number.isFinite(data.length)) {
        return res.status(400).json({ error: 'Comprimento inválido' });
      }

      const updated = await db.catches.update(id, data);
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
      const id = parseId(req.params.id);
      if (!id) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const deleted = await db.catches.delete(id);
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
