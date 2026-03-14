-- Script de configuração inicial do banco de dados
-- Execute este script após criar o banco de dados "fishingapp"

-- Conectar ao banco (se estiver usando psql)
-- \c fishingapp

-- Criar tabelas
CREATE TABLE IF NOT EXISTS catches (
  id SERIAL PRIMARY KEY,
  species VARCHAR(100) NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  length DECIMAL(5,2) NOT NULL,
  location VARCHAR(200) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  weather VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fishing_spots (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  catches_count INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS weather_data (
  id SERIAL PRIMARY KEY,
  temp DECIMAL(4,1),
  wind_speed INTEGER,
  wind_direction VARCHAR(10),
  wave_height DECIMAL(3,1),
  pressure INTEGER,
  humidity INTEGER,
  visibility INTEGER,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_catches_date ON catches(date DESC);
CREATE INDEX IF NOT EXISTS idx_catches_location ON catches(location);
CREATE INDEX IF NOT EXISTS idx_spots_rating ON fishing_spots(rating DESC);
CREATE INDEX IF NOT EXISTS idx_weather_recorded ON weather_data(recorded_at DESC);

-- Inserir dados de clima inicial
INSERT INTO weather_data (temp, wind_speed, wind_direction, wave_height, pressure, humidity, visibility)
VALUES (23.0, 12, 'NE', 0.8, 1013, 75, 10);

-- Verificar tabelas criadas
SELECT 'Tables created successfully!' as status;
\dt
