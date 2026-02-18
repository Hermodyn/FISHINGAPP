-- Database Schema for PostgreSQL
-- Execute este arquivo para criar as tabelas no banco de dados

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

-- Índices para melhor performance
CREATE INDEX idx_catches_date ON catches(date DESC);
CREATE INDEX idx_catches_location ON catches(location);
CREATE INDEX idx_spots_rating ON fishing_spots(rating DESC);
CREATE INDEX idx_weather_recorded ON weather_data(recorded_at DESC);
