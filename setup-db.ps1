$PSQL = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
$SCHEMA = "$PSScriptRoot\backend\database\setup.sql"

Write-Host "Configurando banco de dados PostgreSQL..."
Write-Host ""
Write-Host "Digite a senha do usuario postgres:"
$env:PGPASSWORD = Read-Host -AsSecureString | ConvertFrom-SecureString -AsPlainText

Write-Host ""
Write-Host "Criando banco fishingapp..."
& $PSQL -U postgres -c "CREATE DATABASE fishingapp;" 2>&1 | Out-Null

Write-Host "Criando tabelas..."
& $PSQL -U postgres -d fishingapp -f $SCHEMA

Write-Host ""
Write-Host "Verificando tabelas:"
& $PSQL -U postgres -d fishingapp -c "\dt"

Write-Host ""
Write-Host "Concluido! Proximos passos:"
Write-Host "1. Instale Beekeeper Studio"
Write-Host "2. Execute: cd backend && npm run db:migrate"
Write-Host "3. Execute: npm run dev"

$env:PGPASSWORD = $null
