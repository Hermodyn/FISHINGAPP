const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'fishingapp',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

const db = {
  catches: {
    findAll: async () => {
      const result = await pool.query('SELECT * FROM catches ORDER BY date DESC, time DESC');
      return result.rows;
    },
    
    findById: async (id) => {
      const result = await pool.query('SELECT * FROM catches WHERE id = $1', [id]);
      return result.rows[0] || null;
    },
    
    create: async (data) => {
      const { species, weight, length, location, weather, baitUsed } = data;
      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const time = now.toTimeString().slice(0, 5);
      
      const result = await pool.query(
        `INSERT INTO catches (species, weight, length, location, date, time, weather) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *`,
        [species, weight, length, location, date, time, weather || 'Não informado']
      );
      return result.rows[0];
    },
    
    update: async (id, data) => {
      const fields = [];
      const values = [];
      let paramCount = 1;
      const allowed = new Set(['species', 'weight', 'length', 'location', 'weather', 'baitUsed']);
      
      Object.keys(data).forEach(key => {
        if (!allowed.has(key)) return;
        if (data[key] !== undefined) {
          fields.push(`${key} = $${paramCount}`);
          values.push(data[key]);
          paramCount++;
        }
      });
      
      if (fields.length === 0) return null;
      
      values.push(id);
      const result = await pool.query(
        `UPDATE catches SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $${paramCount} RETURNING *`,
        values
      );
      return result.rows[0] || null;
    },
    
    delete: async (id) => {
      const result = await pool.query('DELETE FROM catches WHERE id = $1 RETURNING id', [id]);
      return result.rowCount > 0;
    }
  },

  spots: {
    findAll: async () => {
      const result = await pool.query('SELECT * FROM fishing_spots ORDER BY rating DESC');
      return result.rows;
    },
    
    findById: async (id) => {
      const result = await pool.query('SELECT * FROM fishing_spots WHERE id = $1', [id]);
      return result.rows[0] || null;
    },
    
    create: async (data) => {
      const { name, latitude, longitude, catches_count, rating } = data;
      const result = await pool.query(
        `INSERT INTO fishing_spots (name, latitude, longitude, catches_count, rating) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, latitude || null, longitude || null, catches_count || 0, rating || 0]
      );
      return result.rows[0];
    },
    
    update: async (id, data) => {
      const fields = [];
      const values = [];
      let paramCount = 1;
      const allowed = new Set(['name', 'latitude', 'longitude', 'catches_count', 'rating']);
      
      Object.keys(data).forEach(key => {
        if (!allowed.has(key)) return;
        if (data[key] !== undefined) {
          fields.push(`${key} = $${paramCount}`);
          values.push(data[key]);
          paramCount++;
        }
      });
      
      if (fields.length === 0) return null;
      
      values.push(id);
      const result = await pool.query(
        `UPDATE fishing_spots SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $${paramCount} RETURNING *`,
        values
      );
      return result.rows[0] || null;
    },
    
    delete: async (id) => {
      const result = await pool.query('DELETE FROM fishing_spots WHERE id = $1 RETURNING id', [id]);
      return result.rowCount > 0;
    }
  },

  weather: {
    getCurrent: async () => {
      const result = await pool.query(
        'SELECT * FROM weather_data ORDER BY recorded_at DESC LIMIT 1'
      );
      
      if (result.rows.length > 0) {
        const data = result.rows[0];
        return {
          temp: parseFloat(data.temp),
          windSpeed: data.wind_speed,
          windDirection: data.wind_direction,
          waveHeight: parseFloat(data.wave_height),
          pressure: data.pressure,
          humidity: data.humidity,
          visibility: data.visibility,
          fishingCondition: 'Bom',
          sunrise: '06:15'
        };
      }
      
      // Fallback se não houver dados
      return {
        temp: 23,
        windSpeed: 12,
        windDirection: 'NE',
        waveHeight: 0.8,
        pressure: 1013,
        humidity: 75,
        visibility: 10,
        fishingCondition: 'Bom',
        sunrise: '06:15'
      };
    },
    
    getForecast: async () => {
      const current = await db.weather.getCurrent();
      return {
        today: current,
        tomorrow: { ...current, temp: current.temp + 2 },
        dayAfter: { ...current, temp: current.temp + 1 }
      };
    }
  },

  // Função para testar conexão
  testConnection: async () => {
    try {
      const result = await pool.query('SELECT NOW()');
      console.log('✅ Database connection test successful:', result.rows[0].now);
      return true;
    } catch (error) {
      console.error('❌ Database connection test failed:', error.message);
      return false;
    }
  },

  // Função para fechar pool (útil para testes)
  close: async () => {
    await pool.end();
  }
};

module.exports = db;
