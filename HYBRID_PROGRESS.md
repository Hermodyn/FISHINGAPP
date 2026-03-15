# 📊 Progresso da Versão Híbrida

## ✅ Concluído

### **Hooks Customizados** (8/8)
- ✅ `useCatches.ts` - Capturas via PostgreSQL
- ✅ `useSpots.ts` - Pontos de pesca via PostgreSQL
- ✅ `useWeather.ts` - Clima via PostgreSQL
- ✅ `useLeagues.ts` - Sistema de ligas (localStorage)
- ✅ `usePhotoGallery.ts` - Galeria de fotos híbrida
- ✅ `useFishScanner.ts` - Scanner AI com validação
- ✅ `useGeolocation.ts` - GPS e localização
- ✅ `useTides.ts` - Dados de maré (WorldTides API)

### **Componentes Base** (4/4)
- ✅ `CatchCard.tsx` - Card de captura otimizado
- ✅ `StatCard.tsx` - Card de estatística
- ✅ `LoadingSpinner.tsx` - Indicador de loading
- ✅ `ErrorMessage.tsx` - Mensagem de erro

### **Serviços**
- ✅ `api.ts` - API service refatorado e modular

### **Utilitários**
- ✅ `useLocalStorage.ts` - Hook genérico para localStorage

---

## 🔄 Próximos Passos

### **1. Criar App.hybrid.tsx**

O App híbrido vai combinar:
- Arquitetura otimizada (hooks + componentes)
- Todas as funcionalidades do App original
- Integração PostgreSQL
- Performance melhorada

**Estrutura sugerida:**
```typescript
function App() {
  // Hooks de dados
  const { catches, addCatch } = useCatches();
  const { spots } = useSpots();
  const { weather } = useWeather();
  const { leagues, createLeague } = useLeagues();
  const { mineGalleryPhotos, toggleLike } = usePhotoGallery(catches);
  const { identifyFish } = useFishScanner();
  const { getCurrentLocation } = useGeolocation();
  const { tideData, fetchTidesForCurrentLocation } = useTides();

  // Estados de UI
  const [activeTab, setActiveTab] = useState('home');
  const [showAddCatch, setShowAddCatch] = useState(false);
  const [showCreateLeague, setShowCreateLeague] = useState(false);
  
  // ... resto da lógica
}
```

### **2. Componentes Adicionais Necessários**

#### **Modal de Registro de Captura**
```typescript
// src/components/AddCatchModal.tsx
interface AddCatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (catch: Catch) => void;
}

export const AddCatchModal = ({ isOpen, onClose, onAdd }) => {
  const { identifyFish, identifiedSpecies } = useFishScanner();
  const { getCurrentLocation } = useGeolocation();
  
  // Form com:
  // - Input de foto (câmera)
  // - Scanner AI
  // - Validação GPS
  // - Campos de dados
  // - Botão de salvar
};
```

#### **Grid de Galeria de Fotos**
```typescript
// src/components/PhotoGalleryGrid.tsx
export const PhotoGalleryGrid = ({ photos, onPhotoClick }) => {
  return (
    <div className="grid grid-cols-3 gap-0.5">
      {photos.map(photo => (
        <PhotoThumbnail key={photo.id} photo={photo} onClick={onPhotoClick} />
      ))}
    </div>
  );
};
```

#### **Card de Liga**
```typescript
// src/components/LeagueCard.tsx
export const LeagueCard = ({ league, ranking, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl p-4">
      <h3>{league.name}</h3>
      <p>{league.category}</p>
      <RankingTable participants={ranking.participants} />
      {league.prizePotEnabled && <PrizePot total={ranking.potTotal} />}
    </div>
  );
};
```

---

## 🎯 Decisões de Arquitetura

### **O que vai para PostgreSQL:**
- ✅ Capturas de peixes (com URLs de fotos)
- ✅ Pontos de pesca
- ✅ Dados climáticos
- 🔜 Usuários (futuro)
- 🔜 Comentários (futuro)

### **O que fica no LocalStorage:**
- ✅ Ligas criadas pelo usuário
- ✅ Legendas de fotos
- ✅ Preferências de UI
- ✅ Cache temporário

### **O que vem de APIs Externas:**
- ✅ WorldTides (marés)
- 🔜 OpenWeather (clima em tempo real)
- 🔜 Google Maps (mapas)

---

## 📝 Checklist de Funcionalidades

### **Home Tab**
- [ ] Dashboard com estatísticas
- [ ] Galeria 3x3 de fotos
- [ ] Botões de ação (Register, Catches, Ligas)
- [ ] Menu de dicas (Info button)

### **Catches Tab**
- [ ] Lista de capturas do PostgreSQL
- [ ] Botão de adicionar (+)
- [ ] Modal de registro com:
  - [ ] Câmera/upload de foto
  - [ ] Scanner AI
  - [ ] Validação de timestamp da foto
  - [ ] GPS automático
  - [ ] Campos: espécie, peso, comprimento, isca
  - [ ] Botão salvar

### **Spots Tab**
- [ ] Lista de pontos do PostgreSQL
- [ ] Mapa interativo
- [ ] Rating e número de capturas
- [ ] Distância calculada

### **Weather Tab**
- [ ] Temperatura e condições
- [ ] Vento, ondas, pressão, umidade
- [ ] Dados de maré (WorldTides):
  - [ ] Altura atual
  - [ ] Status (enchente/vazante)
  - [ ] Próximas marés

### **Leagues Tab**
- [ ] Lista de ligas criadas
- [ ] Botão criar nova liga
- [ ] Modal de criação/edição com:
  - [ ] Nome, categoria, regras
  - [ ] Seleção de amigos
  - [ ] Configuração de premiação
  - [ ] Datas de início/fim
  - [ ] Espécies permitidas
- [ ] Ranking em tempo real
- [ ] Cálculo de premiação

### **Friends Gallery Tab**
- [ ] Toggle: Minhas fotos / Fotos dos amigos
- [ ] Grid de fotos
- [ ] Sistema de likes
- [ ] Comentários
- [ ] Compartilhamento

### **Stats Tab**
- [ ] Total de capturas
- [ ] Peso total/médio
- [ ] Maior captura
- [ ] Ranking global:
  - [ ] Cidade
  - [ ] Estado
  - [ ] País
  - [ ] Mundial

### **Community Tab**
- [ ] Posts estilo Twitter
- [ ] Dicas e discussões
- [ ] Links úteis

### **Subscription Tab**
- [ ] Planos: Free, Pro, Premium
- [ ] Features por plano
- [ ] Patrocinadores
- [ ] Descontos

---

## 🚀 Estratégia de Implementação

### **Opção 1: Incremental** (Recomendado)
1. Criar App.hybrid.tsx com funcionalidades básicas
2. Testar integração PostgreSQL
3. Adicionar funcionalidades uma por uma
4. Testar cada feature antes de prosseguir

### **Opção 2: Big Bang**
1. Copiar todo o App.tsx original
2. Substituir lógica por hooks customizados
3. Refatorar componentes grandes
4. Testar tudo junto

**Recomendo Opção 1** para evitar bugs e facilitar debug.

---

## 📊 Estimativa de Trabalho

### **Componentes Faltantes**
- AddCatchModal: ~200 linhas
- PhotoGalleryGrid: ~100 linhas
- LeagueCard: ~150 linhas
- LeagueModal: ~300 linhas
- TideChart: ~100 linhas
- RankingTable: ~80 linhas

**Total estimado:** ~930 linhas de componentes

### **App.hybrid.tsx**
- Estrutura base: ~200 linhas
- Lógica de tabs: ~100 linhas
- Handlers e callbacks: ~150 linhas
- Renderização de tabs: ~400 linhas

**Total estimado:** ~850 linhas

### **Total Geral**
- Hooks: ✅ ~600 linhas (concluído)
- Componentes base: ✅ ~200 linhas (concluído)
- Componentes features: 🔄 ~930 linhas (pendente)
- App.hybrid: 🔄 ~850 linhas (pendente)

**Total:** ~2580 linhas (vs 3744 do original = 31% de redução)

---

## 🎓 Benefícios da Abordagem Híbrida

### **Performance**
- ✅ Hooks customizados evitam re-renders
- ✅ Componentes memoizados
- ✅ Cálculos otimizados com useMemo
- ✅ Lazy loading de componentes pesados

### **Manutenibilidade**
- ✅ Código modular e organizado
- ✅ Fácil encontrar e modificar features
- ✅ Testes unitários por hook/componente
- ✅ TypeScript previne erros

### **Escalabilidade**
- ✅ Fácil adicionar novas features
- ✅ Hooks reutilizáveis em outros projetos
- ✅ Componentes compartilháveis
- ✅ API service extensível

### **Developer Experience**
- ✅ Código limpo e legível
- ✅ Separação de responsabilidades
- ✅ Documentação inline
- ✅ Intellisense completo (TypeScript)

---

## 🤔 Próxima Decisão

**Você prefere que eu:**

### **A) Criar App.hybrid.tsx completo agora**
- Implementar todas as funcionalidades de uma vez
- Arquivo grande (~850 linhas)
- Pronto para testar tudo junto

### **B) Criar versão incremental**
- Começar com funcionalidades básicas
- Adicionar features gradualmente
- Testar cada etapa

### **C) Criar apenas os componentes faltantes primeiro**
- AddCatchModal, LeagueCard, etc.
- Depois montar o App.hybrid.tsx
- Abordagem mais modular

**Qual abordagem você prefere?** 🤔
