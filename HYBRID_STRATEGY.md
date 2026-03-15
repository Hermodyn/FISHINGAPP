# 🎯 Estratégia da Versão Híbrida - Fishing App

## 📋 Visão Geral

A **versão híbrida** combina o melhor dos dois mundos:
- ✅ **Arquitetura otimizada** (hooks customizados, componentes reutilizáveis)
- ✅ **Todas as funcionalidades** do App original
- ✅ **Integração com PostgreSQL** para dados persistentes
- ✅ **Performance melhorada** com memoização e code splitting

---

## 🏗️ Arquitetura Híbrida

### **Camada de Dados**

#### **PostgreSQL (Dados Persistentes)**
- ✅ Capturas de peixes
- ✅ Pontos de pesca
- ✅ Dados climáticos
- 🔜 Usuários (futuro)
- 🔜 Fotos (URLs armazenadas)

#### **LocalStorage (Dados Locais)**
- ✅ Ligas criadas pelo usuário
- ✅ Legendas de fotos
- ✅ Preferências do usuário
- ✅ Cache temporário

#### **API Externa**
- ✅ WorldTides API (dados de maré)
- 🔜 OpenWeather API (clima em tempo real)

---

## 📦 Hooks Customizados Criados

### **1. Dados do Backend (PostgreSQL)**
```typescript
useCatches()    // Capturas via API
useSpots()      // Pontos de pesca via API
useWeather()    // Clima via API
```

### **2. Funcionalidades Locais**
```typescript
useLeagues()         // Sistema de ligas (localStorage)
usePhotoGallery()    // Galeria de fotos
useFishScanner()     // Scanner AI de peixes
useGeolocation()     // GPS e localização
useTides()           // Dados de maré (WorldTides)
useLocalStorage()    // Utilitário genérico
```

---

## 🎨 Componentes Reutilizáveis

### **Componentes Base**
- `<CatchCard />` - Card de captura
- `<StatCard />` - Card de estatística
- `<LoadingSpinner />` - Indicador de loading
- `<ErrorMessage />` - Mensagem de erro

### **Componentes Complexos** (a criar)
- `<PhotoGalleryGrid />` - Grid de fotos
- `<LeagueCard />` - Card de liga
- `<AddCatchModal />` - Modal de registro
- `<FishScannerModal />` - Modal do scanner AI
- `<TideChart />` - Gráfico de marés
- `<RankingTable />` - Tabela de ranking

---

## 🔄 Fluxo de Dados

### **Registro de Nova Captura**

```
1. Usuário tira foto → useFishScanner()
   ↓
2. Validação de timestamp (< 2min)
   ↓
3. AI identifica espécie
   ↓
4. useGeolocation() obtém GPS
   ↓
5. Usuário preenche dados
   ↓
6. useCatches().addCatch() → PostgreSQL
   ↓
7. Foto salva (URL) + metadados
   ↓
8. usePhotoGallery() atualiza galeria
```

### **Sistema de Ligas**

```
1. Usuário cria liga → useLeagues()
   ↓
2. Dados salvos no localStorage
   ↓
3. Convida amigos (IDs)
   ↓
4. Ranking calculado com catches do PostgreSQL
   ↓
5. Atualização em tempo real
```

### **Dados de Maré**

```
1. Usuário acessa aba Weather
   ↓
2. useTides().fetchTidesForCurrentLocation()
   ↓
3. useGeolocation() obtém coordenadas
   ↓
4. WorldTides API retorna dados
   ↓
5. Exibição de maré atual + próximas
```

---

## 🎯 Funcionalidades Mantidas

### **✅ Home**
- Dashboard com estatísticas
- Galeria de fotos (3x3 grid)
- Botões de ação rápida
- Menu de dicas

### **✅ Capturas**
- Lista de capturas (PostgreSQL)
- Botão de adicionar (+)
- Modal de registro com:
  - Scanner AI
  - Validação GPS
  - Validação de foto em tempo real
  - Campos de dados

### **✅ Pontos de Pesca**
- Lista de pontos (PostgreSQL)
- Mapa interativo
- Avaliações e ratings
- Distância calculada

### **✅ Clima**
- Temperatura e condições
- Vento, ondas, pressão
- Dados de maré (WorldTides)
- Previsão

### **✅ Ligas**
- Criar/editar ligas
- Convidar amigos
- Ranking em tempo real
- Premiação (fictícia/real)
- Regras personalizadas

### **✅ Galeria de Amigos**
- Fotos de amigos
- Sistema de likes
- Comentários
- Compartilhamento

### **✅ Estatísticas**
- Total de capturas
- Peso total/médio
- Maior captura
- Ranking global (cidade/estado/país/mundo)

### **✅ Comunidade**
- Posts estilo Twitter
- Dicas e discussões
- Links úteis

### **✅ Assinatura**
- Planos Free/Pro/Premium
- Features por plano
- Patrocinadores

---

## 🚀 Plano de Implementação

### **Fase 1: Base (Concluída)** ✅
- [x] Hooks customizados
- [x] Componentes base
- [x] Integração PostgreSQL
- [x] API service refatorado

### **Fase 2: Funcionalidades Core** (Em Andamento)
- [ ] Modal de registro de captura
- [ ] Scanner AI integrado
- [ ] Validação GPS em tempo real
- [ ] Galeria de fotos completa
- [ ] Sistema de ligas funcional

### **Fase 3: Features Avançadas**
- [ ] Dados de maré (WorldTides)
- [ ] Ranking global
- [ ] Sistema de amigos
- [ ] Comunidade/Posts
- [ ] Compartilhamento social

### **Fase 4: Otimizações**
- [ ] Code splitting
- [ ] Lazy loading de imagens
- [ ] Service Worker (PWA)
- [ ] Offline support
- [ ] Performance monitoring

---

## 📊 Estrutura de Arquivos Final

```
src/
├── hooks/
│   ├── useCatches.ts          ✅ PostgreSQL
│   ├── useSpots.ts            ✅ PostgreSQL
│   ├── useWeather.ts          ✅ PostgreSQL
│   ├── useLeagues.ts          ✅ LocalStorage
│   ├── usePhotoGallery.ts     ✅ Híbrido
│   ├── useFishScanner.ts      ✅ AI Mock
│   ├── useGeolocation.ts      ✅ GPS
│   ├── useTides.ts            ✅ WorldTides API
│   └── useLocalStorage.ts     ✅ Utilitário
│
├── components/
│   ├── base/
│   │   ├── CatchCard.tsx      ✅
│   │   ├── StatCard.tsx       ✅
│   │   ├── LoadingSpinner.tsx ✅
│   │   └── ErrorMessage.tsx   ✅
│   │
│   ├── features/
│   │   ├── PhotoGalleryGrid.tsx    🔜
│   │   ├── LeagueCard.tsx          🔜
│   │   ├── AddCatchModal.tsx       🔜
│   │   ├── FishScannerModal.tsx    🔜
│   │   ├── TideChart.tsx           🔜
│   │   └── RankingTable.tsx        🔜
│   │
│   └── layout/
│       ├── Header.tsx              🔜
│       ├── BottomNav.tsx           🔜
│       └── TabContent.tsx          🔜
│
├── services/
│   └── api.ts                 ✅ Refatorado
│
├── utils/
│   ├── dateFormatter.ts       🔜
│   ├── validators.ts          🔜
│   └── constants.ts           🔜
│
├── types/
│   └── index.ts               🔜 Tipos centralizados
│
└── App.hybrid.tsx             🔜 Versão final
```

---

## 🎨 Design Principles

### **1. Performance First**
- Memoização estratégica
- Lazy loading
- Code splitting
- Otimização de imagens

### **2. User Experience**
- Loading states claros
- Error handling robusto
- Feedback visual imediato
- Offline support

### **3. Maintainability**
- Código modular
- Componentes reutilizáveis
- Hooks customizados
- TypeScript strict

### **4. Scalability**
- Arquitetura extensível
- Fácil adicionar features
- Testes unitários
- Documentação clara

---

## 🔧 Configuração Necessária

### **Variáveis de Ambiente**

```env
# Backend API
VITE_API_URL=http://localhost:3001/api

# WorldTides API
VITE_WORLDTIDES_KEY=sua-chave-aqui

# Features Flags (opcional)
VITE_ENABLE_AI_SCANNER=true
VITE_ENABLE_TIDES=true
VITE_ENABLE_LEAGUES=true
```

### **Dependências Adicionais**

```bash
# React Query (cache avançado)
npm install @tanstack/react-query

# Date utilities
npm install date-fns

# Charts (para gráfico de marés)
npm install recharts

# Image optimization
npm install react-lazy-load-image-component
```

---

## 📈 Métricas de Sucesso

### **Performance**
- [ ] Bundle size < 500 KB
- [ ] Initial load < 1.5s
- [ ] Lighthouse Score > 90

### **Funcionalidades**
- [ ] Todas as features do original funcionando
- [ ] Integração PostgreSQL 100%
- [ ] Zero bugs críticos

### **UX**
- [ ] Loading states em todas as operações
- [ ] Error handling em todas as APIs
- [ ] Feedback visual imediato

---

## 🚦 Status Atual

- ✅ **Hooks customizados**: 8/8 criados
- ✅ **Componentes base**: 4/4 criados
- 🔄 **Componentes features**: 0/6 criados
- 🔄 **App híbrido**: Em planejamento
- ⏳ **Testes**: Pendente
- ⏳ **Documentação**: Em andamento

---

## 📝 Próximos Passos

1. **Criar componentes de features complexas**
2. **Montar App.hybrid.tsx com todas as funcionalidades**
3. **Testar integração completa**
4. **Otimizar performance**
5. **Adicionar testes unitários**
6. **Deploy em produção**

---

**Versão:** 3.0 Hybrid  
**Status:** 🔄 Em Desenvolvimento  
**Última Atualização:** 2026-03-14
