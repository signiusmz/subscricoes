# Contas de Acesso - DZUMUKA

## Contas Criadas

### 🔐 Super Administrador

**Credenciais:**
- Email: `admin@dzumuka.com`
- Password: `Admin123!@#`

**Detalhes:**
- Empresa: DZUMUKA Admin
- Plano: Premium
- Status: Ativo
- Tipo: Super Admin (acesso a todas as empresas)

**Como fazer login:**
1. Acesse a página de login
2. Clique no card "Super Administrador" na seção "Acesso Rápido"
3. Ou marque a caixa "Acesso Super Admin" e use as credenciais
4. Terá acesso ao painel de Super Admin

---

### 🔐 Administrador Regular

**Credenciais:**
- Email: `admin@empresa.com`
- Password: `Admin123!@#`

**Detalhes:**
- Empresa: Empresa Demo
- Plano: Pro
- Status: Trial (14 dias)
- Tipo: Admin (acesso apenas à sua empresa)

**Como fazer login:**
1. Acesse a página de login
2. Clique no card "Administrador da Empresa" na seção "Acesso Rápido"
3. Ou digite as credenciais manualmente
4. Terá acesso ao dashboard normal da empresa

---

## Segurança

⚠️ **IMPORTANTE**: Estas são contas de demonstração. Para produção:

1. **Altere as passwords imediatamente** após o primeiro login
2. **Não compartilhe** estas credenciais
3. **Ative autenticação de dois fatores** quando disponível
4. **Revise as políticas de acesso** regularmente

---

## Diferenças entre os Tipos de Conta

| Recurso | Super Admin | Admin Regular |
|---------|-------------|---------------|
| Ver todas as empresas | ✅ | ❌ |
| Gerenciar própria empresa | ✅ | ✅ |
| Criar/editar clientes | ✅ | ✅ |
| Criar/editar serviços | ✅ | ✅ |
| Ver dashboard da empresa | ✅ | ✅ |
| Acesso Super Admin Dashboard | ✅ | ❌ |
| Gerenciar outras empresas | ✅ | ❌ |

---

## Próximos Passos

1. **Teste o login** com ambas as contas
2. **Explore a plataforma** e suas funcionalidades
3. **Crie dados de teste** (clientes, serviços, etc.)
4. **Configure a empresa** nas definições
5. **Convide membros da equipa** (quando estiver pronto)

---

## Problemas de Login?

Se tiver problemas para fazer login:

1. Verifique se está usando o email e password corretos
2. Confirme que está conectado à internet
3. Limpe o cache do navegador
4. Tente em modo anónimo/privado

Se o problema persistir, execute novamente o script de setup:
```bash
npx tsx scripts/setupAccounts.ts
```

---

**Data de criação:** 04 de Dezembro de 2025
