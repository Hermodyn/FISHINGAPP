// Database abstraction layer
// Pode ser facilmente substituído por PostgreSQL, MongoDB, etc.

let catches = [
  {
    id: 1,
    species: 'Robalo',
    weight: 2.5,
    length: 45,
    location: 'Lagoa da Conceição',
    date: '2026-02-15',
    time: '06:30',
    weather: 'Ensolarado'
  },
  {
    id: 2,
    species: 'Corvina',
    weight: 3.2,
    length: 52,
    location: 'Praia da Armação',
    date: '2026-02-14',
    time: '17:45',
    weather: 'Nublado'
  }
];

let spots = [
  { id: 1, name: 'Lagoa da Conceição', catches: 15, rating: 4.5 },
  { id: 2, name: 'Praia da Armação', catches: 12, rating: 4.2 },
  { id: 3, name: 'Barra da Lagoa', catches: 8, rating: 4.0 }
];

const weather = {
  temp: 23,
  windSpeed: 12,
  windDirection: 'NE',
  waveHeight: 0.8,
  pressure: 1013,
  humidity: 75,
  visibility: 10
};

const db = {
  catches: {
    findAll: async () => catches,
    findById: async (id) => catches.find(c => c.id === parseInt(id)),
    create: async (data) => {
      const newCatch = {
        id: catches.length + 1,
        ...data,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5)
      };
      catches = [newCatch, ...catches];
      return newCatch;
    },
    update: async (id, data) => {
      const index = catches.findIndex(c => c.id === parseInt(id));
      if (index === -1) return null;
      catches[index] = { ...catches[index], ...data };
      return catches[index];
    },
    delete: async (id) => {
      const index = catches.findIndex(c => c.id === parseInt(id));
      if (index === -1) return false;
      catches.splice(index, 1);
      return true;
    }
  },

  spots: {
    findAll: async () => spots,
    findById: async (id) => spots.find(s => s.id === parseInt(id)),
    create: async (data) => {
      const newSpot = {
        id: spots.length + 1,
        ...data
      };
      spots.push(newSpot);
      return newSpot;
    },
    update: async (id, data) => {
      const index = spots.findIndex(s => s.id === parseInt(id));
      if (index === -1) return null;
      spots[index] = { ...spots[index], ...data };
      return spots[index];
    },
    delete: async (id) => {
      const index = spots.findIndex(s => s.id === parseInt(id));
      if (index === -1) return false;
      spots.splice(index, 1);
      return true;
    }
  },

  weather: {
    getCurrent: async () => ({
      ...weather,
      fishingCondition: 'Bom',
      sunrise: '06:15'
    }),
    getForecast: async () => ({
      today: weather,
      tomorrow: { ...weather, temp: 25 },
      dayAfter: { ...weather, temp: 24 }
    })
  }
};

module.exports = db;
