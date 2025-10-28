# GitHub Actions Pipelines

Este repositório contém três pipelines principais para CI/CD:

## 1. Pipeline de CI (Continuous Integration) - `ci-pipeline.yml`

### Funcionalidades:
- **Checkout**: Baixa o código do repositório
- **Dependency Check**: Usa OWASP Dependency Check para verificar vulnerabilidades em dependências
- **SonarQube Quality Gate**: Executa análise de qualidade de código
- **SAST**: Análise estática de segurança usando Semgrep e CodeQL

### Triggers:
- Push para branches `main` ou `develop`
- Pull requests para branch `main`
- **Execução manual** com opções para:
  - Executar scan completo de segurança
  - Pular execução de testes

## 2. Pipeline de CD (Continuous Deployment) - `cd-pipeline.yml`

### Funcionalidades:
- **Prebuild**: Validação e geração de versão
- **Build**: Empacotamento da aplicação
- **Docker Image Creation**: Criação e push da imagem Docker
- **Image Registration**: Registro no Azure Container Registry
- **Deploy**: Deploy para staging e produção no Azure

### Triggers:
- Após conclusão bem-sucedida da pipeline de CI
- **Execução manual** com opções para:
  - Seleção de ambiente (staging, production, both)
  - Forçar deploy mesmo se CI falhar
  - Pular testes pré-deploy

## 3. Pipeline de Testing e Release - `testing-release-pipeline.yml`

### Funcionalidades:
- **Integration Tests**: Testes de integração contra ambiente de staging
- **DAST**: Testes de segurança dinâmica usando OWASP ZAP e Nuclei
- **E2E Tests**: Testes end-to-end usando Playwright
- **Release Management**: Criação de releases e promoção para produção

### Triggers:
- Após conclusão da pipeline de CD
- **Execução manual** com opções para:
  - Tipo de teste (all, integration, dast, e2e, security-only)
  - Ambiente alvo (staging, production)
  - Pular testes de performance
  - Controlar criação de release
- Agendamento diário para DAST

## Configuração Necessária

### Secrets do GitHub

Configure os seguintes secrets no repositório:

#### Azure
```
AZURE_CREDENTIALS          # Service Principal JSON para autenticação no Azure
AZURE_ACR_USERNAME         # Username do Azure Container Registry
AZURE_ACR_PASSWORD         # Password do Azure Container Registry
```

#### SonarQube
```
SONAR_TOKEN                # Token de autenticação do SonarQube
SONAR_HOST_URL            # URL do servidor SonarQube
```

#### Security Tools
```
SEMGREP_APP_TOKEN         # Token do Semgrep (opcional)
NVD_API_KEY              # API Key do NIST NVD para Dependency Check
```

#### GitHub
```
GITHUB_TOKEN             # Token do GitHub (geralmente disponível automaticamente)
```

### Variáveis de Ambiente

As seguintes variáveis são configuradas nos workflows:

- `REGISTRY`: vulnapp67acr.azurecr.io
- `IMAGE_NAME`: vulnapp67
- `AZURE_WEBAPP_NAME`: vulnapp67
- `AZURE_RESOURCE_GROUP`: az-vuln-app

### Configuração do Azure

1. **Criar Service Principal**:
```bash
az ad sp create-for-rbac --name "github-actions-sp" --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/az-vuln-app \
  --sdk-auth
```

2. **Configurar Azure Container Registry**:
```bash
az acr create --resource-group az-vuln-app --name vulnapp67acr --sku Basic
az acr update -n vulnapp67acr --admin-enabled true
```

3. **Criar Azure Web Apps**:
```bash
# Staging
az webapp create --resource-group az-vuln-app --plan vulnapp67plan \
  --name vulnapp67-staging --deployment-container-image-name vulnapp67acr.azurecr.io/vulnapp67:latest

# Production
az webapp create --resource-group az-vuln-app --plan vulnapp67plan \
  --name vulnapp67 --deployment-container-image-name vulnapp67acr.azurecr.io/vulnapp67:latest
```

### Ambientes GitHub

Configure os seguintes ambientes no GitHub:

1. **staging**: Para deploys de staging
2. **production**: Para deploys de produção (com aprovação manual recomendada)

## Estrutura dos Workflows

```
.github/
└── workflows/
    ├── ci-pipeline.yml              # Pipeline de CI
    ├── cd-pipeline.yml              # Pipeline de CD
    └── testing-release-pipeline.yml # Pipeline de Testing e Release
```

## Fluxo de Execução

1. **Desenvolvedor** faz push ou cria PR
2. **CI Pipeline** executa:
   - Testes unitários
   - Dependency check
   - SAST (Semgrep, CodeQL)
   - SonarQube quality gate
3. **CD Pipeline** executa (se CI passar):
   - Build da aplicação
   - Criação da imagem Docker
   - Deploy para staging
   - Deploy para produção (se aprovado)
4. **Testing Pipeline** executa (após CD):
   - Testes de integração
   - DAST security tests
   - E2E tests
   - Release management

## Monitoramento e Relatórios

- **Artifacts**: Todos os relatórios são salvos como artifacts
- **SARIF**: Resultados de segurança são enviados para o GitHub Security tab
- **Releases**: Releases automáticos são criados após deploys bem-sucedidos
- **Notificações**: Status é reportado via GitHub checks

## Customização

Para adaptar as pipelines ao seu ambiente:

1. Atualize as variáveis de ambiente nos workflows
2. Configure os secrets necessários
3. Ajuste os nomes dos recursos Azure
4. Modifique os testes conforme necessário
5. Configure as regras de aprovação nos ambientes