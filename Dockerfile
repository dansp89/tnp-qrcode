FROM oven/bun:1.1.43-slim

# Install system dependencies
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

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile --no-save

# Copy the rest of the application
COPY . .

# Build the application
RUN bun run build

# Expose the port the app runs on
EXPOSE 6541

# Start the application
CMD ["bun", "start"]
