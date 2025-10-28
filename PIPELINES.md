# GitHub Actions CI/CD Pipelines

## Resumo

Este repositório agora conta com um sistema completo de CI/CD usando GitHub Actions, composto por três pipelines principais:

### 📋 Pipeline 1: CI (Continuous Integration)
**Arquivo:** `.github/workflows/ci-pipeline.yml`

**Funcionalidades implementadas:**
- ✅ **Checkout** do código
- ✅ **Dependency Check** usando OWASP
- ✅ **SonarQube Quality Gate** para análise de qualidade
- ✅ **SAST** (Static Application Security Testing):
  - Semgrep para análise de segurança
  - CodeQL para análise de código
  - Upload automático de resultados SARIF
- ✅ **Execução Manual** com opções para scan completo e pular testes

### 🚀 Pipeline 2: CD (Continuous Deployment)
**Arquivo:** `.github/workflows/cd-pipeline.yml`

**Funcionalidades implementadas:**
- ✅ **Prebuild** com validação e versionamento
- ✅ **Build** e empacotamento da aplicação
- ✅ **Docker Image Creation** com multi-platform build
- ✅ **Image Registration** no Azure Container Registry
- ✅ **Deploy** automatizado para staging e produção no Azure
- ✅ Scan de vulnerabilidades na imagem Docker (Trivy)
- ✅ **Execução Manual** com seleção de ambiente e opções de force deploy

### 🧪 Pipeline 3: Testing e Release Management
**Arquivo:** `.github/workflows/testing-release-pipeline.yml`

**Funcionalidades implementadas:**
- ✅ **Integration Tests** contra ambiente de staging/produção
- ✅ **DAST** (Dynamic Application Security Testing):
  - OWASP ZAP baseline e full scan
  - Nuclei vulnerability scanner
- ✅ **E2E Tests** usando Playwright
- ✅ **Release Management** com criação automática de releases
- ✅ **Execução Manual** com seleção de tipos de teste e ambiente alvo

## 📁 Arquivos Criados

### Pipelines GitHub Actions
```
.github/
├── workflows/
│   ├── ci-pipeline.yml              # Pipeline de CI
│   ├── cd-pipeline.yml              # Pipeline de CD
│   └── testing-release-pipeline.yml # Pipeline de Testing
├── README.md                        # Documentação detalhada das pipelines
├── secrets-template.md              # Template para configuração de secrets
└── MANUAL_EXECUTION.md             # Guia de execução manual das pipelines
```

### Configurações de Ferramentas
```
.zap/
└── rules.tsv                        # Regras customizadas para OWASP ZAP

sonar-project.properties             # Configuração do SonarQube
playwright.config.js                 # Configuração do Playwright
```

### Testes E2E
```
tests/
└── e2e/
    ├── basic-navigation.spec.js     # Testes básicos de navegação
    └── security-tests.spec.js       # Testes de segurança específicos
```

### Package.json Atualizado
- Scripts de teste adicionados
- Dependências do Playwright incluídas

## 🔧 Configuração Necessária

### 1. Secrets do GitHub (obrigatórios)
Configure estes secrets no repositório GitHub:

```bash
# Azure
AZURE_CREDENTIALS          # JSON do Service Principal
AZURE_ACR_USERNAME         # Username do ACR
AZURE_ACR_PASSWORD         # Password do ACR

# SonarQube
SONAR_TOKEN                # Token do SonarQube
SONAR_HOST_URL            # URL do SonarQube (ex: https://sonarcloud.io)

# Security Tools (opcionais para funcionalidades avançadas)
SEMGREP_APP_TOKEN         # Token do Semgrep
NVD_API_KEY              # API Key do NIST NVD
```

### 2. Recursos Azure (já existentes conforme README original)
- Resource Group: `az-vuln-app`
- Container Registry: `vulnapp67acr`
- App Service: `vulnapp67`
- App Service Staging: `vulnapp67-staging`

### 3. Ambientes GitHub
Configure estes ambientes no GitHub:
- `staging` - Para deploys de staging
- `production` - Para deploys de produção (recomenda-se ativar aprovação manual)

## 🔄 Fluxo de Execução

1. **Developer** faz push/PR → **CI Pipeline** executa
2. **CI** passa → **CD Pipeline** executa automaticamente
3. **CD** completa → **Testing Pipeline** executa automaticamente

### Triggers Específicos:
- **CI**: Push para `main`/`develop`, PRs para `main`
- **CD**: Após CI bem-sucedida, execução manual
- **Testing**: Após CD, execução manual, agendamento diário

## 📊 Relatórios e Monitoramento

### Artifacts Gerados:
- Relatórios de dependency check
- Resultados SAST (SARIF)
- Relatórios DAST (ZAP, Nuclei)
- Resultados E2E (Playwright)
- Screenshots de testes
- Relatórios de compliance de segurança

### Integração com GitHub:
- Resultados de segurança aparecem na aba Security
- Checks automáticos em PRs
- Releases automáticos após deploys bem-sucedidos

## 🛡️ Recursos de Segurança

### SAST (Static Analysis):
- **Semgrep**: Regras de segurança específicas para Node.js
- **CodeQL**: Análise profunda de código
- **SonarQube**: Quality gates e security hotspots

### DAST (Dynamic Analysis):
- **OWASP ZAP**: Baseline e full scan
- **Nuclei**: Vulnerability scanner
- **Trivy**: Container image scanning

### Compliance:
- Verificação automática de vulnerabilidades críticas
- Relatórios de compliance
- Quality gates que impedem deploys inseguros

## 🚀 Para Começar

1. **Configure os secrets** usando o template em `.github/secrets-template.md`
2. **Configure os ambientes** staging/production no GitHub
3. **Faça um push** para a branch `main` ou **execute manualmente** via Actions
4. **Acompanhe** a execução das pipelines na aba Actions
5. **Monitore** os resultados na aba Security

### 📖 Execução Manual
Para executar as pipelines manualmente com opções customizadas, consulte o guia detalhado em `.github/MANUAL_EXECUTION.md`.

As pipelines estão prontas para uso e seguem as melhores práticas de DevSecOps, incluindo shift-left security e automated compliance checking.

## 📞 Suporte

Para dúvidas sobre configuração ou customização das pipelines, consulte:
- Documentação detalhada em `.github/README.md`
- Templates de configuração em `.github/secrets-template.md`
- Logs das execuções na aba Actions do GitHub