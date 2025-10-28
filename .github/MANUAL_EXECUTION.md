# Manual Workflow Execution Guide

Todas as três pipelines agora suportam execução manual via `workflow_dispatch` com diversas opções de configuração.

## 🔧 Como Executar Manualmente

1. Acesse o repositório no GitHub
2. Vá para a aba **Actions**
3. Selecione o workflow desejado na lateral esquerda
4. Clique em **Run workflow**
5. Configure os parâmetros conforme necessário
6. Clique em **Run workflow** para executar

## 📋 Pipeline de CI - Opções Disponíveis

### Parâmetros:
- **run_full_scan** (boolean, default: true)
  - Executa scan completo de segurança incluindo todas as ferramentas SAST
  - Se false, executa apenas verificações básicas

- **skip_tests** (boolean, default: false)
  - Pula a execução de testes unitários
  - Útil para focar apenas na análise de segurança

### Casos de Uso:
- Teste rápido de mudanças específicas
- Verificação de segurança após alterações críticas
- Debug de problemas específicos na pipeline

## 🚀 Pipeline de CD - Opções Disponíveis

### Parâmetros:
- **environment** (choice, default: staging)
  - `staging`: Deploy apenas para staging
  - `production`: Deploy apenas para produção
  - `both`: Deploy para ambos os ambientes

- **force_deploy** (boolean, default: false)
  - Força o deploy mesmo se a pipeline de CI falhar
  - ⚠️ Use com cuidado - apenas para correções críticas

- **skip_tests** (boolean, default: false)
  - Pula testes pré-deploy
  - Acelera o processo para deploys urgentes

### Casos de Uso:
- Deploy de hotfixes críticos
- Promoção manual para produção
- Teste de processo de deploy
- Deploy em ambiente específico

## 🧪 Pipeline de Testing - Opções Disponíveis

### Parâmetros:
- **test_type** (choice, default: all)
  - `all`: Executa todos os tipos de teste
  - `integration`: Apenas testes de integração
  - `dast`: Apenas testes de segurança dinâmica
  - `e2e`: Apenas testes end-to-end
  - `security-only`: Apenas testes de segurança (DAST + compliance)

- **target_environment** (choice, default: staging)
  - `staging`: Testa contra ambiente de staging
  - `production`: Testa contra ambiente de produção

- **skip_performance_tests** (boolean, default: false)
  - Pula testes de baseline de performance
  - Útil para focar apenas em funcionalidade

- **create_release** (boolean, default: true)
  - Cria release automático após testes bem-sucedidos
  - Se false, apenas executa os testes sem criar release

### Casos de Uso:
- Validação específica após deploy
- Testes de segurança contra produção
- Verificação de performance
- Criação de releases manuais
- Auditoria de segurança agendada

## 🎯 Cenários Comuns de Uso

### 1. Hotfix Crítico
```
1. CI Pipeline: skip_tests=true, run_full_scan=false
2. CD Pipeline: environment=production, force_deploy=true
3. Testing Pipeline: test_type=integration, target_environment=production
```

### 2. Auditoria de Segurança
```
1. Testing Pipeline: test_type=security-only, target_environment=production
```

### 3. Deploy Controlado
```
1. CD Pipeline: environment=staging
2. Testing Pipeline: test_type=all, target_environment=staging
3. CD Pipeline: environment=production (após validação)
```

### 4. Validação de Performance
```
1. Testing Pipeline: test_type=integration, skip_performance_tests=false
```

### 5. Teste de Funcionalidades
```
1. Testing Pipeline: test_type=e2e, target_environment=staging
```

## ⚡ Dicas de Uso

### Performance:
- Use `skip_tests=true` em CI para execução mais rápida
- Use `test_type=integration` para validação rápida
- Use `skip_performance_tests=true` para focar em funcionalidade

### Segurança:
- Use `test_type=security-only` para auditorias focadas
- Use `target_environment=production` para validação real
- Sempre revise resultados de `force_deploy=true`

### Debug:
- Execute pipelines individualmente para isolar problemas
- Use diferentes combinações de parâmetros para identificar issues
- Monitore artifacts gerados para análise detalhada

## 🔒 Considerações de Segurança

### Force Deploy:
- `force_deploy=true` bypassa quality gates
- Use apenas para correções críticas
- Sempre execute testes após force deploy

### Production Testing:
- Testes contra produção podem impactar performance
- DAST em produção deve ser feito fora de horários de pico
- Configure rate limiting apropriado

### Environment Selection:
- Sempre valide em staging antes de produção
- Use `both` environments apenas quando necessário
- Monitore recursos durante deploys simultâneos

## 📊 Monitoramento

### Logs:
- Todos os parâmetros são registrados nos logs
- Artifacts contêm detalhes de execução
- Status é reportado via GitHub checks

### Notificações:
- Falhas são notificadas automaticamente
- Sucessos são reportados com detalhes
- Releases incluem informações dos testes executados