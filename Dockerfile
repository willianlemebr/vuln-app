# Use a imagem oficial do Node.js como base
FROM node:14

# Cria e define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências da aplicação
RUN npm install

# Copia todo o código da aplicação para o diretório de trabalho
COPY . .

# Expõe a porta 3000 para acesso à aplicação
EXPOSE 3000

# Define o comando para iniciar a aplicação
CMD ["npm", "start"]
