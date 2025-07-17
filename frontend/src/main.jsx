// 1. Importações de Pacotes e Componentes
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// 2. Importações de Efeito Colateral (Configuração e Estilos)
import './firebase.js'; // Agora ele vai encontrar este arquivo!
import './index.css';

// 3. Renderização da Aplicação
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);