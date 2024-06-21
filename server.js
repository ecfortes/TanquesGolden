// server.js

const express = require('express');
const app = express();
const routes = require('./routes/index');
const mqttClient = require('./api/services/MqttService');
const PORT = process.env.PORT || 80;

// Configurar o EJS como mecanismo de visualização
app.set('view engine', 'ejs');

// Middleware para analisar requisições codificadas em URL
app.use(express.urlencoded({ extended: false }));

// Middleware para analisar requisições JSON
app.use(express.json());

// Servir arquivos estáticos (CSS, imagens, etc.)
app.use(express.static('public'));

// Rotas principais

app.use('/', routes);

mqttClient.connectMqtt();


// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


