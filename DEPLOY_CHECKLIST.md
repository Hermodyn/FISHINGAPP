# Checklist de Deploy - Fishing App

## ✅ Pré-Deploy (Concluído)

- [x] Configuração do Netlify (`netlify.toml`)
- [x] Build command configurado: `npm run build`
- [x] Publish directory configurado: `dist`
- [x] Redirects para SPA routing configurados
- [x] `.gitignore` configurado (exclui `node_modules`, `dist`, `.netlify`)
- [x] Metadados do HTML otimizados (lang, description, theme-color)
- [x] Build testado localmente e funcionando

## 📋 Passos para Deploy

### 1. Preparar Repositório Git

```bash
# Verificar status
git status

# Adicionar arquivos
git add .

# Commit
git commit -m "feat: preparado para deploy no Netlify com modal de mapa mockado"

# Push para repositório remoto
git push origin main
```

### 2. Deploy no Netlify

**Opção A: Via Interface Web (Recomendado)**

1. Acesse https://app.netlify.com/
2. Clique em "Add new site" → "Import an existing project"
3. Conecte ao GitHub/GitLab/Bitbucket
4. Selecione o repositório `FISHINGAPP`
5. Configurações detectadas automaticamente:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Clique em "Deploy site"
7. Aguarde o build (2-3 minutos)

**Opção B: Via Netlify CLI**

```bash
# Instalar CLI (se ainda não tiver)
npm install -g netlify-cli

# Login
netlify login

# Inicializar
netlify init

# Deploy
netlify deploy --prod
```

### 3. Configurar Variáveis de Ambiente (Opcional)

**Apenas se você tiver backend em produção:**

1. No Netlify: Site settings → Environment variables
2. Adicionar:
   - `VITE_API_URL` = `https://sua-api.com/api`

**Nota**: Por enquanto não é necessário, o app funciona 100% no frontend.

### 4. Verificar Deploy

Após o deploy, testar:

- [ ] Página inicial carrega (`https://seu-site.netlify.app/`)
- [ ] Navegação funciona (Home, Liga, Lugares, Amigos)
- [ ] Imagens carregam (background, galeria)
- [ ] Modal de mapa abre ao clicar "Ver no Mapa"
- [ ] Galeria de fotos funciona (zoom, navegação, curtir)
- [ ] Formulário de nova captura funciona
- [ ] Criação de ligas funciona
- [ ] Feed da comunidade carrega
- [ ] Responsividade mobile funciona

### 5. Configurações Pós-Deploy (Opcional)

- [ ] Configurar domínio personalizado
- [ ] Configurar analytics (Netlify Analytics ou Google Analytics)
- [ ] Configurar notificações de deploy
- [ ] Configurar branch deploys (staging/production)

## 🔧 Arquivos de Configuração

### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### package.json - Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

## 🚀 URLs Após Deploy

- **Produção**: `https://[nome-do-site].netlify.app`
- **Preview (PRs)**: `https://deploy-preview-[numero]--[nome-do-site].netlify.app`
- **Branch deploys**: `https://[branch]--[nome-do-site].netlify.app`

## 📊 Métricas de Build

- **Tempo de build**: ~10-15 segundos
- **Tamanho do bundle**: ~288 KB (JS) + ~56 KB (CSS)
- **Assets**: Imagens em `/public` servidas diretamente

## 🐛 Troubleshooting

### Build falha

```bash
# Testar build localmente
npm run build

# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Página em branco

- Verificar console do navegador (F12)
- Verificar se assets estão carregando
- Verificar redirects no `netlify.toml`

### Imagens não carregam

- Verificar se estão em `/public`
- Verificar paths (devem começar com `/`)
- Exemplo: `/Fundo.jpg` (correto) vs `Fundo.jpg` (errado)

## 📝 Notas Importantes

1. **Build automático**: Cada push para `main` gera novo deploy
2. **Preview deploys**: Pull Requests geram deploys de preview
3. **Rollback**: Netlify permite voltar para deploys anteriores
4. **Cache**: Netlify faz cache automático de assets
5. **HTTPS**: Ativado automaticamente via Let's Encrypt

## 🎯 Próximos Passos Após Deploy

1. Compartilhar URL com stakeholders
2. Testar em diferentes dispositivos (iOS, Android)
3. Configurar domínio personalizado (se aplicável)
4. Monitorar analytics e performance
5. Planejar integração com backend (quando pronto)

## 📞 Suporte

- Documentação: https://docs.netlify.com/
- Community: https://answers.netlify.com/
- Status: https://www.netlifystatus.com/
