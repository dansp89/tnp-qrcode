# Gerador de QR Code PIX

Aplicativo web para gerar QR Codes PIX personalizados com fundo personalizado.

## Recursos

- Geração de QR Code PIX personalizável
- Adição de QR Code de referência
- Interface em português brasileiro
- Fácil personalização de posições e tamanhos
- Suporte a imagens de fundo personalizadas
- Interface responsiva

## Pré-requisitos

- [Bun](https://bun.sh/) (versão 1.0.0 ou superior)

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/dansp89/tnp-qrcode.git
   cd tnp-qrcode
   ```

2. Instale as dependências:

   ```bash
   bun i
   ```

## Executando o projeto

1. Inicie o servidor de desenvolvimento:

   ```bash
   bun run dev
   ```

   ```bash
   bun run start
   ```

2. Acesse a aplicação no navegador:

   ```sh
   http://localhost:6541
   ```

## Executando com Docker

Você pode executar a aplicação usando Docker de duas maneiras: com comandos Docker diretamente ou usando Docker Compose. Certifique-se de ter o [Docker](https://www.docker.com/get-started) instalado em sua máquina.

### Método 1: Usando Docker Compose (Recomendado)

1. Navegue até o diretório do projeto e execute:

   ```bash
   # Iniciar o contêiner em segundo plano
   docker compose up -d
   ```

   Para verificar os logs:

   ```bash
   docker compose logs -f
   ```

2. Acesse a aplicação no navegador:

   ```text
   http://localhost:6541
   ```

3. Comandos úteis:

   ```bash
   # Parar os contêineres
   docker compose down
   
   # Reconstruir e reiniciar os contêineres (após alterações no código)
   docker compose up --build -d
   ```

   Para verificar os logs em tempo real:

   ```bash
   docker compose logs -f
   ```

### Método 2: Usando comandos Docker diretamente

1. Construa a imagem:

   ```bash
   docker build -t tnp-qrcode .
   ```

2. Execute o contêiner:

   ```bash
   docker run -d --name tnp-qrcode -p 6541:6541 tnp-qrcode
   ```

   - `-d`: Executa o contêiner em segundo plano
   - `--name tnp-qrcode`: Nomeia o contêiner
   - `-p 6541:6541`: Mapeia a porta 6541 do contêiner para a porta 6541 do host
   - `tnp-qrcode`: Nome da imagem a ser executada

3. Acesse a aplicação no navegador:

   ```text
   http://localhost:6541
   ```

4. Gerenciando o contêiner:

   ```bash
   # Verificar logs
   docker logs tnp-qrcode
   # Parar o contêiner
   docker stop tnp-qrcode
   ```

   ```bash
   # Iniciar o contêiner novamente
   docker start tnp-qrcode

   # Remover o contêiner (após parar)
   docker rm tnp-qrcode
   ```

### Personalização da Imagem de Fundo

Para usar uma imagem de fundo personalizada, substitua o arquivo `flyer.jpg` na raiz do projeto antes de construir a imagem Docker. Se estiver usando Docker Compose, você pode montar um volume para substituir a imagem sem reconstruir o contêiner:

```yaml
version: '3.8'
services:
  tnp-qrcode:
    build: .
    container_name: tnp-qrcode
    ports:
      - "6541:6541"
    volumes:
      - ./sua-imagem.jpg:/app/flyer.jpg
    restart: unless-stopped
```

## Personalização

### Imagem de Fundo

Substitua o arquivo `flyer.jpg` na raiz do projeto por sua própria imagem. A imagem será redimensionada automaticamente.

### Ajustes de Posicionamento

Para ajustar o posicionamento dos QR Codes, edite o arquivo `src/index.ts`:

```typescript
// Configurações de tamanho dos QR Codes
const qrPixSize = 930;  // Tamanho do QR Code do PIX
const qrRefSize = 280;  // Tamanho do QR Code de referência

// Configurações de posição do QR Code do PIX
const qrPixConfig = {
  x: (background.getWidth() - qrPixSize) / 2,  // Centralizado horizontalmente
  y: (background.getHeight() - qrPixSize) / 2,  // Centralizado verticalmente
  offsetX: 45,  // Ajuste fino horizontal (positivo = direita, negativo = esquerda)
  offsetY: -70  // Ajuste fino vertical (positivo = baixo, negativo = cima)
};

// Configurações de posição do QR Code de referência
const qrRefConfig = {
  x: 50,  // Distância da borda esquerda
  y: background.getHeight() - qrRefSize - 150,  // Distância do topo
  offsetX: 120,  // Ajuste fino horizontal
  offsetY: 20    // Ajuste fino vertical
};
```

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Créditos

Desenvolvido por [dansP89](https://github.com/dansp89)

---

Dica: Para contribuições, por favor abra uma issue ou envie um pull request no [repositório do projeto](https://github.com/dansp89/tnp-qrcode).

Desenvolvido por [dansP89](https://github.com/dansp89)
