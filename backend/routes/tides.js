const express = require('express');
const router = express.Router();

function parseNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

router.get('/current', async (req, res) => {
  const apiKey = process.env.WORLDTIDES_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'WORLDTIDES_KEY not configured' });
  }

  const lat = parseNumber(req.query.lat);
  const lon = parseNumber(req.query.lon);

  if (lat === null || lon === null) {
    return res.status(400).json({ error: 'lat and lon are required' });
  }

  try {
    const url = new URL('https://www.worldtides.info/api/v3');
    url.searchParams.set('heights', '');
    url.searchParams.set('extremes', '');
    url.searchParams.set('date', 'today');
    url.searchParams.set('days', '1');
    url.searchParams.set('localtime', '1');
    url.searchParams.set('lat', String(lat));
    url.searchParams.set('lon', String(lon));
    url.searchParams.set('key', apiKey);

    const resp = await fetch(url.toString());
    const text = await resp.text();

    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }

    if (!resp.ok) {
      return res.status(resp.status).json({ error: (data && data.error) ? data.error : 'Upstream error' });
    }

    if (data && data.error) {
      return res.status(502).json({ error: data.error });
    }

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Tides proxy error' });
  }
});

module.exports = router;
