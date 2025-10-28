# Configuração de Secrets - Template

## Este arquivo contém exemplos de como configurar os secrets necessários para as pipelines

### Azure Credentials (AZURE_CREDENTIALS)
```json
{
  "clientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "clientSecret": "your-client-secret",
  "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

### Como gerar:
```bash
az ad sp create-for-rbac --name "github-actions-sp" --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/az-vuln-app \
  --sdk-auth
```

### Azure Container Registry
- **AZURE_ACR_USERNAME**: Nome do registry (ex: vulnapp67acr)
- **AZURE_ACR_PASSWORD**: Password do ACR (obtido via `az acr credential show`)

```bash
az acr credential show --name vulnapp67acr
```

### SonarQube
- **SONAR_TOKEN**: Token gerado no SonarQube Server/Cloud
- **SONAR_HOST_URL**: URL do servidor (ex: https://sonarcloud.io)

### Security Tools
- **SEMGREP_APP_TOKEN**: Token do Semgrep (opcional, para funcionalidades avançadas)
- **NVD_API_KEY**: API Key do NIST NVD para melhor performance do Dependency Check

### GitHub Token
- **GITHUB_TOKEN**: Automaticamente disponível nas GitHub Actions

## Comandos para configurar secrets via CLI:

```bash
# Azure credentials
gh secret set AZURE_CREDENTIALS --body "$(cat azure-credentials.json)"

# ACR credentials
gh secret set AZURE_ACR_USERNAME --body "vulnapp67acr"
gh secret set AZURE_ACR_PASSWORD --body "your-acr-password"

# SonarQube
gh secret set SONAR_TOKEN --body "your-sonar-token"
gh secret set SONAR_HOST_URL --body "https://sonarcloud.io"

# Security tools
gh secret set SEMGREP_APP_TOKEN --body "your-semgrep-token"
gh secret set NVD_API_KEY --body "your-nvd-api-key"
```

## Verificação dos secrets:

```bash
gh secret list
```