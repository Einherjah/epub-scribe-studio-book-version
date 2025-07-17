// 1. Importar a caixa de ferramentas (Express)
const express = require('express');

// 2. Criar nossa aplicação (o servidor)
const app = express();
const PORT = 3001; // Definimos uma "porta" para o nosso servidor. 3001 é uma boa escolha.

// 3. Criar nossa primeira rota (um endereço URL)
// Quando alguém acessar http://localhost:3001/status, o servidor responderá.
app.get('/status', (req, res) => {
  res.send('O motor do backend está funcionando como esperado!');
});

// 4. Ligar o motor do servidor
app.listen(PORT, () => {
  console.log(`Backend rodando e ouvindo na porta ${PORT}`);
});