# 🎣 Fishing App - Guia do Pescador

Criar uma comunidade onde pescadores possam registrar e compartilhar seus peixes pescados com seus amigos, seja pessoalmente ou online, acabando com as “histórias de pescador”, já que o registro só pode ser feito em tempo real.

Permitir competir e se divertir com seus amigos, criando ligas de competições por categorias definidas pelo próprio usuário.

## 🎨 Design

Interface inspirada no **FISHFINDER Loveble** com:
- Gradiente suave azul/ciano no fundo
- Cards escuros com bordas sutis
- Tipografia: Outfit (corpo) e Space Grotesk (títulos)
- Botões circulares de ação rápida
- Design compacto e minimalista

## 🏗️ Arquitetura

O projeto está separado em camadas independentes:

```
📁 FISHINGAPP/
├── 🎨 Frontend (React + TypeScript + Vite)
├── 🔌 API (Express Routes)
├── ⚙️  Backend (Controllers)
└── 💾 Database (PostgreSQL / In-memory)
```

**Veja detalhes completos em**: [`ARCHITECTURE.md`](./ARCHITECTURE.md)

## 🚀 Como Executar

### 1. Backend (API)
```bash
cd backend
npm install
npm run dev
```
Servidor rodando em `http://localhost:3001`

### 2. Frontend
```bash
npm install
npm run dev
```
App rodando em `http://localhost:5173`

## 📋 Funcionalidades

- ✅ Registrar capturas de peixes
- ✅ Visualizar histórico de capturas
- ✅ Pontos de pesca favoritos
- ✅ Condições climáticas em tempo real
- ✅ Estatísticas de pesca
- ✅ Design responsivo mobile-first

## 🛠️ Tecnologias

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide Icons

### Backend
- Node.js
- Express.js
- CORS

### Database
- PostgreSQL (produção)
- In-memory (desenvolvimento)

## 📝 API Endpoints

```
GET    /api/catches          # Lista capturas
POST   /api/catches          # Cria captura
GET    /api/spots            # Lista pontos
GET    /api/weather/current  # Clima atual
```

## 🔐 Configuração

1. Copie `.env.example` para `.env`
2. Configure as variáveis de ambiente
3. Execute backend e frontend

## 📚 Documentação

- [Arquitetura Completa](./ARCHITECTURE.md)
- [Schema do Banco](./backend/database/schema.sql)

## 🎯 Próximos Passos

- [ ] Conectar frontend com backend
- [ ] Implementar autenticação
- [ ] Deploy em produção
- [ ] Adicionar geolocalização
- [ ] Integração com API de clima real

---

Desenvolvido com ❤️ para pescadores
