# 🔐 Como Resetar a Senha do PostgreSQL

## Método 1: Via pg_hba.conf (Mais Seguro)

### Passo 1: Localizar o arquivo pg_hba.conf

O arquivo está em: `C:\Program Files\PostgreSQL\18\data\pg_hba.conf`

### Passo 2: Fazer backup do arquivo

```powershell
Copy-Item "C:\Program Files\PostgreSQL\18\data\pg_hba.conf" "C:\Program Files\PostgreSQL\18\data\pg_hba.conf.backup"
```

### Passo 3: Editar o arquivo

Abra o arquivo `pg_hba.conf` com **Bloco de Notas como Administrador**:

1. Clique com botão direito no Bloco de Notas
2. "Executar como Administrador"
3. Abra o arquivo: `C:\Program Files\PostgreSQL\18\data\pg_hba.conf`

### Passo 4: Modificar autenticação

Procure por linhas que começam com:
```
# IPv4 local connections:
host    all             all             127.0.0.1/32            scram-sha-256
```

**Altere** `scram-sha-256` para `trust`:
```
# IPv4 local connections:
host    all             all             127.0.0.1/32            trust
```

Faça o mesmo para a linha IPv6:
```
# IPv6 local connections:
host    all             all             ::1/128                 trust
```

**Salve o arquivo**

### Passo 5: Reiniciar PostgreSQL

Execute como Administrador:

```powershell
Restart-Service postgresql-x64-18
```

### Passo 6: Alterar a senha

Agora você pode conectar SEM senha:

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';"
```

Isso define a senha como `postgres`

### Passo 7: Restaurar segurança

1. Abra novamente o `pg_hba.conf`
2. Volte `trust` para `scram-sha-256`
3. Salve o arquivo
4. Reinicie o serviço:

```powershell
Restart-Service postgresql-x64-18
```

### Passo 8: Testar nova senha

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres
# Digite a senha: postgres
```

---

## Método 2: Reinstalar PostgreSQL (Última Opção)

Se nada funcionar:

1. Desinstale o PostgreSQL pelo Painel de Controle
2. Delete a pasta `C:\Program Files\PostgreSQL`
3. Delete a pasta `C:\Users\herme\AppData\Local\PostgreSQL`
4. Reinstale e **ANOTE A SENHA**

---

## ⚠️ IMPORTANTE

Após resetar a senha para `postgres`, atualize o arquivo:

**backend/.env**
```env
DB_PASSWORD=postgres
```
