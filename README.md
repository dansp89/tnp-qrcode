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
- Node.js (opcional, apenas se preferir usar npm/yarn)

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/tnp-qrcode.git
   cd tnp-qrcode
   ```

2. Instale as dependências:

   ```bash
   bun install
   ```

   Ou, se estiver usando npm:

   ```bash
   npm install
   ```

## Executando o projeto

1. Inicie o servidor de desenvolvimento:

   ```bash
   bun run dev
   ```

   Ou, para produção:

   ```bash
   bun run start
   ```

2. Acesse a aplicação no navegador:

   ```sh
   http://localhost:6541
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
