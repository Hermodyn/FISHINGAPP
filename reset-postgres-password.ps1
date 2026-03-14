# Script para resetar senha do PostgreSQL
# Execute este script para definir uma nova senha

$PSQL = "C:\Program Files\PostgreSQL\18\bin\psql.exe"

Write-Host "=== Reset de Senha do PostgreSQL ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Este script vai resetar a senha do usuario 'postgres'"
Write-Host ""

# Pedir nova senha
Write-Host "Digite a NOVA senha que deseja usar:" -ForegroundColor Yellow
$newPassword = Read-Host -AsSecureString
$newPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($newPassword))

Write-Host ""
Write-Host "Confirme a senha:" -ForegroundColor Yellow
$confirmPassword = Read-Host -AsSecureString
$confirmPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($confirmPassword))

if ($newPasswordPlain -ne $confirmPasswordPlain) {
    Write-Host ""
    Write-Host "ERRO: As senhas nao coincidem!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Alterando senha..." -ForegroundColor Cyan

# Alterar senha (usando autenticação trust temporária)
$query = "ALTER USER postgres WITH PASSWORD '$newPasswordPlain';"
& $PSQL -U postgres -c $query 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Senha alterada com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Nova senha: $newPasswordPlain" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "IMPORTANTE: Anote esta senha!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Atualize o arquivo backend\.env com a nova senha" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Erro ao alterar senha. Tente a Opcao 3 (Manual)" -ForegroundColor Red
}
