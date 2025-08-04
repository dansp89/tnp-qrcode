FROM oven/bun:1.1.43-slim

# Instala dependências de sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3 \
    pkg-config \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

# Define diretório de trabalho
WORKDIR /app

# Copia arquivos de dependência
COPY package.json bun.lockb ./

# Instala dependências com limite de memória
RUN NODE_OPTIONS=--max_old_space_size=4096 bun install --frozen-lockfile --no-save

# Copia o restante do projeto
COPY . .

# Build da aplicação
RUN bun run build

# Expõe a porta
EXPOSE 6541

# Inicia a aplicação
CMD ["bun", "start"]
