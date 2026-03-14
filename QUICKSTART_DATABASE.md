# 🚀 Guia Rápido - PostgreSQL + Beekeeper Studio

## ✅ Checklist de Instalação

### 1️⃣ Instalar PostgreSQL

**Download**: https://www.postgresql.org/download/windows/

Durante a instalação:
- ✅ Senha do postgres: `postgres` (anote se usar outra)
- ✅ Porta: `5432`
- ✅ Instalar: PostgreSQL Server + pgAdmin + Command Line Tools

### 2️⃣ Criar o Banco de Dados

Abra **SQL Shell (psql)** ou **PowerShell**:

```bash
# Conectar (senha: postgres)
psql -U postgres

# Criar banco
CREATE DATABASE fishingapp;

# Conectar ao banco
\c fishingapp

# Executar schema
\i 'C:/Users/herme/CascadeProjects/FISHINGAPP/backend/database/setup.sql'

# Verificar tabelas
\dt

# Sair
\q
```

### 3️⃣ Instalar Beekeeper Studio

**Download**: https://www.beekeeperstudio.io/

**Configurar conexão**:
- Type: `PostgreSQL`
- Host: `localhost`
- Port: `5432`
- User: `postgres`
- Password: `postgres`
- Database: `fishingapp`

### 4️⃣ Popular o Banco com Dados

No terminal do projeto:

```bash
cd backend
npm run db:migrate
```

Isso criará:
- ✅ 2 capturas iniciais
- ✅ 8 pontos de pesca
- ✅ Dados de clima

### 5️⃣ Ativar PostgreSQL no Backend

Edite `backend/database/db.js`:

```javascript
// Trocar esta linha:
module.exports = require('./db');

// Por esta:
module.exports = require('./postgres');
```

### 6️⃣ Reiniciar o Servidor

```bash
npm run dev
```

Você verá: `✅ Connected to PostgreSQL database`

---

## 🔍 Verificar no Beekeeper

1. Abra Beekeeper Studio
2. Conecte ao banco `fishingapp`
3. Navegue pelas tabelas:
   - `catches` - Capturas de peixes
   - `fishing_spots` - Pontos de pesca
   - `weather_data` - Dados climáticos

---

## 🛠️ Comandos Úteis

```bash
# Testar conexão com banco
npm run db:test

# Popular banco com dados
npm run db:migrate

# Iniciar servidor
npm run dev
```

---

## ⚠️ Problemas Comuns

**Erro: "database fishingapp does not exist"**
→ Execute: `CREATE DATABASE fishingapp;` no psql

**Erro: "password authentication failed"**
→ Verifique senha no arquivo `backend/.env`

**Erro: "relation catches does not exist"**
→ Execute o arquivo `setup.sql` no banco

**Porta 5432 em uso**
→ Outro PostgreSQL já está rodando

---

## 📊 Estrutura do Banco

```
fishingapp/
├── catches (id, species, weight, length, location, date, time, weather)
├── fishing_spots (id, name, latitude, longitude, catches_count, rating)
└── weather_data (id, temp, wind_speed, wind_direction, wave_height, ...)
```
