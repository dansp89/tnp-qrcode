# Use a imagem base oficial do Node.js 20 (LTS)
FROM node:20-slim

# Instala dependências do sistema necessárias
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    unzip \
    xz-utils \
    python3 \
    build-essential \
    pkg-config \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

# Instala o Bun (versão específica para maior estabilidade)
RUN curl -fsSL https://bun.sh/install | bash -s "bun-v1.1.43"

# Configura o ambiente
ENV NODE_ENV=production \
    PORT=6541 \
    BUN_INSTALL="/root/.bun" \
    PATH="$BUN_INSTALL/bin:$PATH"

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de definição de dependências primeiro para aproveitar o cache do Docker
COPY package.json bun.lock* ./

# Instala as dependências do projeto
RUN echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> /root/.bashrc && \
    . /root/.bashrc && \
    bun --version && \
    bun install --no-save

# Copia o restante dos arquivos do projeto
COPY . .

# Compila o TypeScript
RUN . /root/.bashrc && bun run build

# Expõe a porta que a aplicação vai rodar
EXPOSE 6541

# Comando para iniciar a aplicação
CMD ["/bin/bash", "-c", "source /root/.bashrc && bun run start"]
