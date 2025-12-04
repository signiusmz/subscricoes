# Integração MPGS (MasterCard Payment Gateway Services)

## Visão Geral

O sistema agora suporta pagamentos recorrentes através do **MPGS** (MasterCard Payment Gateway Services) com cartões Visa e MasterCard. O MPesa foi completamente removido e substituído por esta integração mais robusta.

## Características Implementadas

### 1. Pagamento com Cartão (Visa/MasterCard)
- Checkout hospedado seguro via MPGS
- Suporte para pagamentos únicos e recorrentes
- Interface de pagamento PCI-compliant
- Nenhum dado de cartão é armazenado no sistema

### 2. Subscrições Recorrentes
- Renovação automática mensal até cancelamento
- Gerenciamento de subscrições pelo painel admin
- Histórico completo de pagamentos
- Webhooks para notificações de pagamento

### 3. Painel de Configuração Admin
- Interface dedicada para configurar credenciais MPGS
- Campos seguros para:
  - **Merchant ID**: ID do comerciante MPGS
  - **API Username**: Username da API (formato: merchant.[MerchantID])
  - **API Password**: Password gerado no Merchant Administration
- Teste de conexão integrado
- Suporte para ambientes de teste e produção

## Estrutura de Arquivos

### Serviços
- `/src/utils/mpgsService.ts` - Serviço principal de integração MPGS
- `/supabase/functions/mpgs-webhook/index.ts` - Edge function para webhooks

### Componentes
- `/src/components/billing/MPGSPayment.tsx` - Interface de pagamento
- `/src/components/settings/PaymentSettings.tsx` - Painel de configuração

### Banco de Dados
- `payment_settings` - Armazena configurações MPGS
- `subscription_payments` - Rastreia histórico de pagamentos

## Configuração

### 1. Obter Credenciais MPGS

1. Acesse o **Merchant Administration Portal** da MPGS
2. Navegue para **Admin → Integration Settings**
3. Ative a autenticação baseada em password
4. Clique em **Generate New** para criar um API Password
5. Anote as credenciais:
   - Merchant ID
   - API Username (merchant.[seu_merchant_id])
   - API Password (gerado)

### 2. Configurar no Sistema

1. Acesse o sistema como **Super Admin**
2. Vá em **Configurações → Pagamentos**
3. Preencha os campos:
   - **Ambiente**: Selecione "Produção" para uso real
   - **Merchant ID**: Cole o ID fornecido
   - **API Username**: Cole o username (merchant.XXXXX)
   - **API Password**: Cole o password gerado
   - **Gateway URL**: https://gateway.mastercard.com (padrão)
4. Clique em **Testar Conexão** para validar
5. Clique em **Salvar Configurações**

### 3. Ambiente de Teste

Para testes, use:
- **Ambiente**: Teste
- **Gateway URL**: https://test-gateway.mastercard.com
- Use credenciais de teste fornecidas pela MPGS

## Fluxo de Pagamento

### Pagamento de Subscrição

```
1. Usuário escolhe plano → 2. Clica em "Pagar Agora"
         ↓
3. Sistema cria sessão MPGS → 4. Abre modal de pagamento
         ↓
5. Usuário preenche dados do cartão → 6. MPGS processa
         ↓
7. Webhook notifica sistema → 8. Subscrição ativada
```

### Renovação Automática

```
1. Data de renovação chega → 2. MPGS cobra automaticamente
         ↓
3. Webhook notifica resultado → 4. Sistema atualiza status
         ↓
5. Se sucesso: Subscrição renovada
6. Se falha: Notificação ao cliente
```

## Segurança

### Dados Protegidos
- Credenciais MPGS criptografadas no banco
- Acesso restrito a Super Admins
- RLS (Row Level Security) implementado
- Nenhum dado de cartão armazenado

### Conformidade PCI
- Checkout hospedado (Hosted Checkout)
- Dados de cartão nunca passam pelo servidor
- MPGS é PCI DSS Level 1 certified

## Webhooks

### URL do Webhook
```
https://[seu-projeto].supabase.co/functions/v1/mpgs-webhook
```

### Configuração no MPGS
1. Acesse o Merchant Administration
2. Vá em **Webhooks**
3. Adicione a URL acima
4. Selecione eventos:
   - Payment Authorized
   - Payment Captured
   - Payment Failed

### Eventos Processados
- `PAYMENT_SUCCESS`: Pagamento confirmado
- `PAYMENT_FAILURE`: Pagamento falhou
- `SUBSCRIPTION_RENEWED`: Subscrição renovada

## API do Serviço MPGS

### Criar Sessão de Pagamento
```typescript
const mpgsService = new MPGSService(config);
const session = await mpgsService.createCheckoutSession({
  orderId: 'ORD_123',
  amount: 1500,
  currency: 'MZN',
  description: 'Subscrição Professional',
  customerId: 'company-id',
  customerEmail: 'cliente@email.com'
});
```

### Verificar Pagamento
```typescript
const result = await mpgsService.verifyPayment(orderId, transactionId);
if (result.result === 'SUCCESS') {
  // Pagamento confirmado
}
```

### Testar Conexão
```typescript
const isValid = await mpgsService.testConnection();
```

## Cancelamento de Subscrição

### Para Cancelar
1. Usuário acessa **Configurações → Empresa**
2. Clica em "Cancelar Subscrição"
3. Confirma cancelamento
4. Sistema marca para não renovar

**Nota**: O acesso continua até o fim do período pago.

## Troubleshooting

### Erro: "Configuração de pagamento não encontrada"
- Verifique se as credenciais foram configuradas em **Configurações → Pagamentos**
- Confirme que o campo "Ativar método de pagamento MPGS" está marcado

### Erro: "Session creation failed"
- Verifique as credenciais (Merchant ID, Username, Password)
- Teste a conexão em **Configurações → Pagamentos**
- Confirme que está usando o ambiente correto (teste/produção)

### Erro: "Payment verification failed"
- Verifique se o webhook está configurado corretamente
- Confirme que a URL do webhook está acessível
- Verifique logs do edge function no Supabase

### Pagamento não aparece como concluído
- Aguarde alguns segundos (webhook pode demorar)
- Verifique se o webhook foi recebido nos logs
- Confirme que não há erros no edge function

## Ambiente de Desenvolvimento

### Variáveis de Ambiente (.env)
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key

# As credenciais MPGS são configuradas pelo painel admin
# Não adicione aqui por segurança
```

### Cartões de Teste MPGS

Para ambiente de teste, use:

**Visa (Aprovado)**
- Número: 4508 7500 0000 0022
- CVV: 100
- Validade: 12/25

**MasterCard (Aprovado)**
- Número: 5123 4500 0000 0008
- CVV: 100
- Validade: 12/25

**Visa (Negado)**
- Número: 4508 7500 0000 0030
- CVV: 100
- Validade: 12/25

## Suporte

Para questões técnicas sobre MPGS:
- Documentação: https://test-gateway.mastercard.com/api/documentation
- Suporte MPGS: Entre em contato com seu account manager

Para questões sobre a integração:
- Verifique os logs no Supabase Dashboard
- Revise este documento
- Entre em contato com a equipe de desenvolvimento

## Referências

- [MPGS Integration Guide](https://test-gateway.mastercard.com/api/documentation/integrationGuidelines/hostedCheckout/integrationModelHostedCheckout.html)
- [MPGS API Reference](https://test-gateway.mastercard.com/api/rest)
- [Hosted Checkout Documentation](https://test-gateway.mastercard.com/checkout)
