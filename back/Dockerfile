# Define a imagem base
FROM node:16

# Define o diretório de trabalho no contêiner
WORKDIR /app

# Copia os arquivos de definição de pacotes para o diretório /app
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install
RUN npm install pm2 -g && npm install ts-node -g && npm install typescript -g

# RUN npm rebuild bcrypt

# Copia todos os arquivos do diretório atual (/back) para /app no contêiner
COPY . .

# Expõe a porta que o Node.js vai rodar
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["sh", "-c", "sleep 30 && npm start"]
