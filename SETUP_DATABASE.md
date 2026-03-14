# 🗄️ Configuração do Banco de Dados PostgreSQL

## 📥 1. Instalar PostgreSQL

### Opção A: Download Direto (Recomendado)
1. Acesse: https://www.postgresql.org/download/windows/
2. Baixe o instalador do PostgreSQL 16
3. Execute o instalador:
   - **Senha do superusuário (postgres)**: `postgres` (ou escolha outra e anote)
   - **Porta**: `5432` (padrão)
   - **Locale**: Portuguese, Brazil
4. Marque para instalar: PostgreSQL Server, pgAdmin 4, Command Line Tools

### Opção B: Via Chocolatey
```powershell
# Execute PowerShell como Administrador
choco install postgresql -y
```

## 🎯 2. Criar o Banco de Dados

Após instalar o PostgreSQL, abra o **SQL Shell (psql)** ou **PowerShell**:

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar o banco de dados
CREATE DATABASE fishingapp;

# Conectar ao banco criado
\c fishingapp

# Executar o schema (copie e cole o conteúdo do arquivo schema.sql)
# Ou execute diretamente:
\i 'C:/Users/herme/CascadeProjects/FISHINGAPP/backend/database/schema.sql'

# Verificar tabelas criadas
\dt

# Sair
\q
```

## 📦 3. Instalar Beekeeper Studio

### Download
1. Acesse: https://www.beekeeperstudio.io/
2. Baixe a versão para Windows
3. Instale normalmente

### Configurar Conexão no Beekeeper
1. Abra o Beekeeper Studio
2. Clique em **"New Connection"**
3. Preencha:
   - **Connection Type**: PostgreSQL
   - **Host**: `localhost`
   - **Port**: `5432`
   - **User**: `postgres`
   - **Password**: `postgres` (ou a senha que você definiu)
   - **Default Database**: `fishingapp`
4. Clique em **"Test"** para verificar
5. Clique em **"Connect"**

## 🔧 4. Configurar Backend

O arquivo `.env` já foi criado em `backend/.env` com as configurações:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fishingapp
DB_USER=postgres
DB_PASSWORD=postgres
```

**Importante**: Se você usou uma senha diferente, edite o arquivo `.env`

## ✅ 5. Verificar Instalação

```bash
# Verificar se PostgreSQL está rodando
psql --version

# Conectar ao banco
psql -U postgres -d fishingapp

# Listar tabelas
\dt
```

Você deve ver:
- catches
- fishing_spots
- weather_data

## 🚀 Próximos Passos

Após configurar o PostgreSQL e Beekeeper:
1. Instalar driver Node.js para PostgreSQL (`pg`)
2. Atualizar `backend/database/db.js` para usar PostgreSQL
3. Migrar dados mockados para o banco real
4. Testar conexão via API

---

**Problemas comuns**:
- **Porta 5432 em uso**: Outro PostgreSQL já instalado
- **Senha incorreta**: Verifique a senha definida na instalação
- **Serviço não iniciado**: Inicie o serviço PostgreSQL no Windows Services
