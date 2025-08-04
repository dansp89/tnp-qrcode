# Use a imagem base oficial do Node.js 20 (LTS)
FROM node:20-slim

# Instala o Bun (mais rápido que o npm/yarn)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    && curl -fsSL https://bun.sh/install | bash \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Adiciona o Bun ao PATH
ENV PATH="/root/.bun/bin:${PATH}"

# Define o diretório de trabalho
WORKDIR /app

# Instala dependências do sistema necessárias para o Canvas e outras bibliotecas nativas
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Copia os arquivos de definição de dependências primeiro para aproveitar o cache do Docker
COPY package.json bun.lockb ./

# Instala as dependências do projeto
RUN bun install --frozen-lockfile --production

# Copia o restante dos arquivos do projeto
COPY . .

# Compila o TypeScript
RUN bun run build

# Expõe a porta que a aplicação vai rodar
EXPOSE 6541

# Comando para iniciar a aplicação
CMD ["bun", "run", "start"]
