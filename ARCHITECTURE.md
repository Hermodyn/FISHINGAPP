# 🎣 Arquitetura do Projeto - Fishing App

## 📁 Estrutura de Pastas

```
FISHINGAPP/
├── backend/                    # Backend Node.js + Express
│   ├── controllers/           # Lógica de negócio
│   │   ├── catchesController.js
│   │   ├── spotsController.js
│   │   └── weatherController.js
│   ├── routes/                # Rotas da API
│   │   ├── catches.js
│   │   ├── spots.js
│   │   └── weather.js
│   ├── database/              # Camada de dados
│   │   ├── db.js             # Abstração do banco (in-memory)
│   │   └── schema.sql        # Schema PostgreSQL
│   ├── server.js             # Servidor Express
│   ├── package.json
│   └── .env.example
│
├── src/                       # Frontend React + TypeScript
│   ├── services/             # Camada de serviços
│   │   └── api.ts           # Cliente API
│   ├── components/           # Componentes React (futuro)
│   ├── App.tsx              # Componente principal
│   ├── App.css
│   └── index.css
│
├── public/                    # Arquivos estáticos
├── package.json              # Dependências frontend
└── vite.config.ts           # Configuração Vite

```

## 🏗️ Camadas da Aplicação

### 1️⃣ **Frontend (React + TypeScript + Vite)**
- **Localização**: `/src`
- **Tecnologias**: React, TypeScript, Tailwind CSS, Lucide Icons
- **Responsabilidades**:
  - Interface do usuário
  - Gerenciamento de estado local
  - Comunicação com API via `api.ts`
  - Renderização de componentes

**Principais arquivos**:
- `src/App.tsx` - Componente principal com todas as telas
- `src/services/api.ts` - Cliente HTTP para comunicação com backend
- `src/index.css` - Estilos globais e design tokens

### 2️⃣ **API Layer (Express Routes)**
- **Localização**: `/backend/routes`
- **Tecnologias**: Express.js
- **Responsabilidades**:
  - Definição de endpoints REST
  - Validação de requisições
  - Roteamento para controllers

**Endpoints disponíveis**:
```
GET    /api/catches          # Lista todas as capturas
GET    /api/catches/:id      # Busca captura por ID
POST   /api/catches          # Cria nova captura
PUT    /api/catches/:id      # Atualiza captura
DELETE /api/catches/:id      # Remove captura

GET    /api/spots            # Lista pontos de pesca
GET    /api/spots/:id        # Busca ponto por ID
POST   /api/spots            # Cria novo ponto
PUT    /api/spots/:id        # Atualiza ponto
DELETE /api/spots/:id        # Remove ponto

GET    /api/weather/current  # Clima atual
GET    /api/weather/forecast # Previsão do tempo
```

### 3️⃣ **Backend (Controllers)**
- **Localização**: `/backend/controllers`
- **Tecnologias**: Node.js
- **Responsabilidades**:
  - Lógica de negócio
  - Processamento de dados
  - Interação com camada de dados
  - Tratamento de erros

**Controllers**:
- `catchesController.js` - CRUD de capturas
- `spotsController.js` - CRUD de pontos de pesca
- `weatherController.js` - Dados meteorológicos

### 4️⃣ **Database Layer**
- **Localização**: `/backend/database`
- **Tecnologias**: In-memory (desenvolvimento) / PostgreSQL (produção)
- **Responsabilidades**:
  - Persistência de dados
  - Queries e operações CRUD
  - Abstração do banco de dados

**Arquivos**:
- `db.js` - Implementação in-memory para desenvolvimento
- `schema.sql` - Schema SQL para PostgreSQL em produção

## 🔄 Fluxo de Dados

```
┌─────────────┐
│   Frontend  │
│  (React)    │
└──────┬──────┘
       │
       │ HTTP Request
       ▼
┌─────────────┐
│ API Service │
│  (api.ts)   │
└──────┬──────┘
       │
       │ fetch()
       ▼
┌─────────────┐
│   Routes    │
│  (Express)  │
└──────┬──────┘
       │
       │ req/res
       ▼
┌─────────────┐
│ Controllers │
│  (Logic)    │
└──────┬──────┘
       │
       │ CRUD ops
       ▼
┌─────────────┐
│  Database   │
│   (db.js)   │
└─────────────┘
```

## 🚀 Como Executar

### Backend
```bash
cd backend
npm install
npm run dev
# Servidor rodando em http://localhost:3001
```

### Frontend
```bash
npm install
npm run dev
# App rodando em http://localhost:5173
```

### Configuração
1. Copie `.env.example` para `.env` em ambas as pastas
2. Configure as variáveis de ambiente
3. Execute backend e frontend separadamente

## 🔐 Variáveis de Ambiente

### Backend (`backend/.env`)
```
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fishingapp
DB_USER=postgres
DB_PASSWORD=your_password
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:3001/api
```

## 📊 Banco de Dados

### Desenvolvimento
- **Tipo**: In-memory (JavaScript arrays)
- **Localização**: `backend/database/db.js`
- **Vantagens**: Rápido, sem configuração

### Produção (Recomendado)
- **Tipo**: PostgreSQL
- **Schema**: `backend/database/schema.sql`
- **Tabelas**:
  - `catches` - Capturas de peixes
  - `fishing_spots` - Pontos de pesca
  - `weather_data` - Dados meteorológicos

## 🛠️ Próximos Passos

1. ✅ Estrutura de pastas criada
2. ✅ API REST implementada
3. ✅ Frontend com design FISHFINDER Loveble
4. ⏳ Conectar frontend com backend via `api.ts`
5. ⏳ Implementar PostgreSQL em produção
6. ⏳ Adicionar autenticação de usuários
7. ⏳ Deploy (Frontend: Vercel, Backend: Railway/Render)

## 📝 Convenções de Código

- **Frontend**: TypeScript, functional components, hooks
- **Backend**: JavaScript ES6+, async/await
- **API**: RESTful, JSON responses
- **Errors**: HTTP status codes apropriados
- **Naming**: camelCase (JS), PascalCase (Components)
