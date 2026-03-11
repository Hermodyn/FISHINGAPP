# Guia de Deploy no Netlify

## Pré-requisitos

- Conta no [Netlify](https://www.netlify.com/)
- Repositório Git (GitHub, GitLab ou Bitbucket)
- Node.js instalado localmente (para testes)

## Configuração Atual

O projeto já está configurado para deploy no Netlify com:

- ✅ `netlify.toml` - Configuração de build e redirects
- ✅ Build command: `npm run build`
- ✅ Publish directory: `dist`
- ✅ SPA routing configurado (redirects para index.html)

## Opção 1: Deploy via Git (Recomendado)

### 1. Commit e Push do Código

```bash
git add .
git commit -m "Preparado para deploy no Netlify"
git push origin main
```

### 2. Conectar ao Netlify

1. Acesse [app.netlify.com](https://app.netlify.com/)
2. Clique em **"Add new site"** → **"Import an existing project"**
3. Escolha seu provedor Git (GitHub/GitLab/Bitbucket)
4. Selecione o repositório `FISHINGAPP`
5. Configure:
   - **Branch to deploy**: `main` (ou `master`)
   - **Build command**: `npm run build` (já detectado automaticamente)
   - **Publish directory**: `dist` (já detectado automaticamente)

### 3. Configurar Variáveis de Ambiente (se necessário)

Se você tiver um backend em produção, configure:

1. No painel do Netlify, vá em **Site settings** → **Environment variables**
2. Adicione:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://seu-backend-api.com/api` (URL do seu backend em produção)

**Nota**: Por enquanto, o app funciona 100% no frontend com dados mockados, então essa variável é opcional.

### 4. Deploy Automático

- Netlify vai fazer o build automaticamente
- Cada push para `main` vai gerar um novo deploy
- Preview deploys são criados para Pull Requests

## Opção 2: Deploy Manual (Drag & Drop)

### 1. Build Local

```bash
npm run build
```

Isso cria a pasta `dist/` com os arquivos otimizados.

### 2. Deploy no Netlify

1. Acesse [app.netlify.com](https://app.netlify.com/)
2. Arraste a pasta `dist/` para a área de drop
3. Aguarde o upload e deploy

**Desvantagem**: Não tem deploy automático, precisa fazer upload manual a cada mudança.

## Opção 3: Deploy via Netlify CLI

### 1. Instalar Netlify CLI

```bash
npm install -g netlify-cli
```

### 2. Login

```bash
netlify login
```

### 3. Inicializar o Site

```bash
netlify init
```

Siga as instruções para conectar ao Git ou criar um novo site.

### 4. Deploy

```bash
# Deploy de preview
netlify deploy

# Deploy para produção
netlify deploy --prod
```

## Verificações Pós-Deploy

Após o deploy, verifique:

- ✅ **Página inicial carrega**: `https://seu-site.netlify.app/`
- ✅ **Navegação entre abas funciona** (Home, Liga, Lugares, Amigos)
- ✅ **Imagens carregam** (Fundo.jpg, fotos da galeria)
- ✅ **Modal de mapa abre** ao clicar em "Ver no Mapa"
- ✅ **Responsividade** funciona em mobile

## Configurações Adicionais

### Custom Domain (Domínio Personalizado)

1. No Netlify, vá em **Domain settings**
2. Clique em **Add custom domain**
3. Siga as instruções para configurar DNS

### HTTPS

- Netlify fornece HTTPS automático via Let's Encrypt
- Ativado por padrão

### Performance

O `netlify.toml` já está otimizado com:
- Build otimizado via Vite
- Redirects para SPA routing
- Assets estáticos servidos do `/public`

## Troubleshooting

### Build falha no Netlify

**Erro**: `Command failed with exit code 1`

**Solução**: Verifique se o build funciona localmente:
```bash
npm run build
```

Se funcionar local mas falhar no Netlify, pode ser versão do Node.js. Adicione ao `netlify.toml`:

```toml
[build.environment]
  NODE_VERSION = "20"
```

### Página em branco após deploy

**Causa**: Geralmente problema com paths de assets

**Solução**: Verifique se `vite.config.ts` tem `base: '/'` (já está configurado)

### Rotas 404

**Causa**: Redirects não configurados

**Solução**: Já configurado no `netlify.toml` com:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## URLs de Exemplo

Após o deploy, você terá:

- **URL de produção**: `https://seu-site-nome.netlify.app`
- **URL customizada** (se configurar): `https://seudominio.com`
- **Preview URLs**: `https://deploy-preview-123--seu-site.netlify.app`

## Próximos Passos

1. ✅ Deploy inicial no Netlify
2. 🔄 Configurar domínio personalizado (opcional)
3. 🔄 Conectar backend quando estiver pronto
4. 🔄 Configurar analytics (Netlify Analytics ou Google Analytics)
5. 🔄 Configurar Forms (se adicionar formulários de contato)

## Suporte

- [Documentação Netlify](https://docs.netlify.com/)
- [Netlify Community](https://answers.netlify.com/)
- [Status do Netlify](https://www.netlifystatus.com/)
