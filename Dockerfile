# Estágio de build
FROM node:22.16.0-slim AS builder

# Instala dependências de sistema necessárias
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3 \
    pkg-config \
    # Dependências para o canvas
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    # Dependências adicionais para o Jimp
    libpng-dev \
    libjpeg62-turbo-dev \
    # Dependências para o sistema
    ca-certificates \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Instala o Bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

# Define diretório de trabalho
WORKDIR /app

# Copia arquivos de dependência
COPY package.json bun.lockb ./

# Copia o restante do projeto
COPY . .

# Instala dependências e faz o build
RUN bun install --frozen-lockfile --no-save && \
    bun run build

# Estágio final
FROM node:22.16.0-slim

# Instala dependências de runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libjpeg62-turbo \
    libgif7 \
    librsvg2-2 \
    && rm -rf /var/lib/apt/lists/*

# Instala o Bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

# Define diretório de trabalho
WORKDIR /app

# Copia arquivos do estágio de build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json .

# Expõe a porta
EXPOSE 6541

# Inicia a aplicação
CMD ["bun", "run", "start"]
