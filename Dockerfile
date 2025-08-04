# Estágio de build
FROM node:18-slim AS builder

# Instala dependências de sistema necessárias
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

# Instala o Bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

# Define diretório de trabalho
WORKDIR /app

# Copia arquivos de dependência
COPY package.json bun.lockb ./

# Instala dependências
RUN bun install --frozen-lockfile --no-save

# Copia o restante do projeto
COPY . .

# Build da aplicação
RUN bun run build

# Estágio final
FROM node:18-slim

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
