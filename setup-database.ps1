# Script de configuração do banco de dados PostgreSQL
# Execute este script para criar e configurar o banco fishingapp

$PSQL = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
$DB_NAME = "fishingapp"
$DB_USER = "postgres"
$SCHEMA_FILE = "$PSScriptRoot\backend\database\setup.sql"

Write-Host "🗄️  Configurando banco de dados PostgreSQL..." -ForegroundColor Cyan
Write-Host ""

# Verificar se psql existe
if (-not (Test-Path $PSQL)) {
    Write-Host "❌ PostgreSQL não encontrado em: $PSQL" -ForegroundColor Red
    Write-Host "💡 Verifique se o PostgreSQL está instalado" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ PostgreSQL encontrado" -ForegroundColor Green

# Pedir senha
Write-Host ""
Write-Host "Digite a senha do usuário 'postgres':" -ForegroundColor Yellow
$env:PGPASSWORD = Read-Host -AsSecureString | ConvertFrom-SecureString -AsPlainText

# Criar banco de dados
Write-Host ""
Write-Host "1️⃣ Criando banco de dados '$DB_NAME'..." -ForegroundColor Cyan
$result = & $PSQL -U $DB_USER -c "CREATE DATABASE $DB_NAME;" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Banco de dados criado com sucesso!" -ForegroundColor Green
} elseif ($result -match "already exists") {
    Write-Host "   ⚠️  Banco de dados já existe (OK)" -ForegroundColor Yellow
} else {
    Write-Host "   ❌ Erro ao criar banco: $result" -ForegroundColor Red
    exit 1
}

# Executar schema
Write-Host ""
Write-Host "2️⃣ Criando tabelas..." -ForegroundColor Cyan
$result = & $PSQL -U $DB_USER -d $DB_NAME -f $SCHEMA_FILE 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Tabelas criadas com sucesso!" -ForegroundColor Green
} else {
    Write-Host "   ❌ Erro ao criar tabelas: $result" -ForegroundColor Red
    exit 1
}

# Verificar tabelas
Write-Host ""
Write-Host "3️⃣ Verificando tabelas criadas..." -ForegroundColor Cyan
& $PSQL -U $DB_USER -d $DB_NAME -c "\dt"

Write-Host ""
Write-Host "✅ Configuração do banco concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "   1. Instale o Beekeeper Studio: https://www.beekeeperstudio.io/" -ForegroundColor White
Write-Host "   2. Execute: cd backend && npm run db:migrate" -ForegroundColor White
Write-Host "   3. Execute: npm run dev" -ForegroundColor White
Write-Host ""

# Limpar senha
$env:PGPASSWORD = $null
