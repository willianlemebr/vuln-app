
# Vulnerable Node.js Application

This is a vulnerable Node.js application created for testing Static Application Security Testing (SAST) tools. The application includes several common vulnerabilities such as XSS, command injection, and insecure logging.

## Project Structure

```bash
vulnerable-node-app/
├── Dockerfile
├── docker-compose.yml
├── app.js
├── package.json
├── views/
│   ├── index.html
│   ├── about.html
│   ├── contact.html
│   ├── admin.html 
│   └── style.css
└── README.md
```

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Installing Docker

#### Windows & macOS

1. Download and install Docker Desktop from [Docker's official website](https://www.docker.com/products/docker-desktop).
2. Follow the installation instructions specific to your operating system.

#### Linux

1. Update your existing list of packages:
    ```sh
    sudo apt-get update
    ```
2. Install a few prerequisite packages:
    ```sh
    sudo apt-get install apt-transport-https ca-certificates curl software-properties-common
    ```
3. Add the GPG key for the official Docker repository to your system:
    ```sh
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    ```
4. Add the Docker repository to APT sources:
    ```sh
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    ```
5. Update your package database with the Docker packages from the newly added repo:
    ```sh
    sudo apt-get update
    ```
6. Install Docker:
    ```sh
    sudo apt-get install docker-ce
    ```
7. Start Docker:
    ```sh
    sudo systemctl start docker
    ```
8. Verify that Docker is installed correctly by running the `hello-world` image:
    ```sh
    sudo docker run hello-world
    ```

### Running the Application

1. **Build the Docker image**:


Build and run the Docker container manually:
```sh
docker build -t vuln-app .
docker run -p 3000:3000 vuln-app
```

## Vulnerabilities

- **Exposing Sensitive Information**: The login route logs the username and password to the console.
- **Reflected XSS**: The search route injects the user input directly into the HTML response.
- **Insecure Logging**: The contact form logs sensitive information (email) to the server-side logs.
- **Command Injection**: The admin command execution uses `eval()` to execute commands, leading to possible command injection.

## Disclaimer

This application is intended for educational purposes only. Do not deploy this application in a production environment.

## Creating a Docker Image

To create and save the files in a Docker image:

```sh
docker build --platform linux/amd64 -t vulnapp67 .
docker run -it -p 8088:3000 vulnapp67:latest
```

## Azure Deployment Instructions

1. **Login to Azure**:
    ```sh
    az login
    ```

2. **Create a Resource Group**:
    ```sh
    az group create --name az-vuln-app --location westus
    ```

3. **Create an Azure Container Registry**:
    ```sh
    az acr create --resource-group az-vuln-app --name vulnapp67acr --sku Basic
    ```

4. **Login to the Azure Container Registry**:
    ```sh
    az acr login --name vulnapp67acr
    ```

5. **Enable Admin Access on ACR**:
    ```sh
    az acr update -n vulnapp67acr --admin-enabled true
    ```

6. **Tag and Push the Docker Image to ACR**:
    ```sh
    docker tag vulnapp67 vulnapp67acr.azurecr.io/vulnapp67:v1
    docker push vulnapp67acr.azurecr.io/vulnapp67:v1
    ```

7. **Create an Azure App Service Plan**:
    ```sh
    az appservice plan create --name vulnapp67plan --resource-group az-vuln-app --is-linux --sku F1
    az appservice plan show --name vulnapp67plan --resource-group az-vuln-app
    ```

8. **Create a Web App and Deploy the Docker Container**:
    ```sh
    az webapp create --resource-group az-vuln-app --plan vulnapp67plan --name vulnapp67 --deployment-container-image-name vulnapp67acr.azurecr.io/vulnapp67:v1
    ```

9. **Set Docker Container Configuration**:
    ```sh
    az webapp config container set --name vulnapp67 --resource-group az-vuln-app --docker-custom-image-name vulnapp67acr.azurecr.io/vulnapp67:v1 --docker-registry-server-url https://vulnapp67acr.azurecr.io
    ```

10. **Get the Web App URL**:
    ```sh
    az webapp show --name vulnapp67 --resource-group az-vuln-app --query defaultHostName -o tsv
    ```



################################ This step is only needed if admin on ACR is not used. #######################################
11. **Set Docker Registry Credentials (if required)**:
    ```sh
    az webapp config container set --name vulnapp67 --resource-group az-vuln-app --docker-custom-image-name vulnapp67acr.azurecr.io/vulnapp67:v1 --docker-registry-server-url https://vulnapp67acr.azurecr.io --docker-registry-server-user vulnapp67acr --docker-registry-server-password <ACR_PASSWORD>
    ```

12. **Retrieve the Web App URL again**:
    ```sh
    az webapp show --name vulnapp67 --resource-group az-vuln-app --query defaultHostName -o tsv
    ```
