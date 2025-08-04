import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import QRCode from 'qrcode';
import Jimp from 'jimp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 6541;

// Configuração do Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Rota para gerar os QR Codes
app.post('/gerar-qrcode', async (req, res) => {
  try {
    const { linkPix, linkReferencia } = req.body;
    
    if (!linkPix || !linkReferencia) {
      return res.status(400).json({ error: 'Links PIX e de referência são obrigatórios' });
    }

    // Caminho para a imagem de fundo
    const backgroundPath = path.join(__dirname, '../fly.jpg');
    
    // Carrega a imagem de fundo
    const background = await Jimp.read(backgroundPath);
    
    // Configurações de tamanho dos QR Codes
    const qrPixSize = 930;  // Tamanho do QR Code do PIX
    const qrRefSize = 280;  // Tamanho do QR Code de referência
    
    // Configurações de posição do QR Code do PIX
    const qrPixConfig = {
      x: (background.getWidth() - qrPixSize) / 2,  // Centralizado horizontalmente
      y: (background.getHeight() - qrPixSize) / 2, // Centralizado verticalmente
      offsetX: 45,  // Ajuste fino horizontal (positivo = direita, negativo = esquerda)
      offsetY: -70  // Ajuste fino vertical (positivo = baixo, negativo = cima)
    };
    
    // Configurações de posição do QR Code de referência
    const qrRefConfig = {
      x: 50,  // Distância da borda esquerda
      y: background.getHeight() - qrRefSize - 150,  // Distância do topo
      offsetX: 120,  // Ajuste fino horizontal (positivo = direita, negativo = esquerda)
      offsetY: 20   // Ajuste fino vertical (positivo = baixo, negativo = cima)
    };
    
    // Função para criar um QR Code
    const createQRCode = async (text: string): Promise<Buffer> => {
      // Gera o QR Code como Data URL
      const qrDataURL = await QRCode.toDataURL(text, {
        width: qrPixSize * 2, // Alta resolução para melhor qualidade
        margin: 1,
        color: {
          dark: '#000000',
          light: '#00000000' // Transparente
        }
      });
      
      // Converte Data URL para buffer
      const base64Data = qrDataURL.replace(/^data:image\/png;base64,/, '');
      return Buffer.from(base64Data, 'base64');
    };
    
    // Cria os dois QR Codes
    const [qrPixBuffer, qrRefBuffer] = await Promise.all([
      createQRCode(linkPix),
      createQRCode(linkReferencia)
    ]);
    
    // Carrega as imagens dos QR Codes
    const qrPix = await Jimp.read(qrPixBuffer);
    const qrRef = await Jimp.read(qrRefBuffer);
    
    // Redimensiona os QR Codes com os tamanhos definidos
    qrPix.resize(qrPixSize, qrPixSize);
    qrRef.resize(qrRefSize, qrRefSize);
    
    // Calcula as posições finais com os ajustes
    const qrPixX = qrPixConfig.x + qrPixConfig.offsetX;
    const qrPixY = qrPixConfig.y + qrPixConfig.offsetY;
    const qrRefX = qrRefConfig.x + qrRefConfig.offsetX;
    const qrRefY = qrRefConfig.y + qrRefConfig.offsetY;
    
    // Adiciona os QR Codes à imagem de fundo
    background.composite(qrPix, qrPixX, qrPixY);
    background.composite(qrRef, qrRefX, qrRefY);
    
    // Carrega a fonte para adicionar texto
    // const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    // const fontSmall = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    
    // Adiciona rótulo abaixo do QR Code de referência
    // background.print(
    //   fontSmall,
    //   qrRefX,
    //   qrRefY + qrRefSize + 10,
    //   `Ref: ${linkReferencia}`,
    //   qrRefSize
    // );
    
    // Caminho para salvar a imagem resultante
    const outputPath = path.join(__dirname, '../public/qrcode-gerado.jpg');
    
    // Salva a imagem
    await background.writeAsync(outputPath);
    
    // Retorna o caminho da imagem gerada
    res.json({ 
      success: true, 
      imageUrl: '/qrcode-gerado.jpg',
      timestamp: new Date().getTime() // Para evitar cache do navegador
    });
    
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    res.status(500).json({ error: 'Erro ao gerar QR Code' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
