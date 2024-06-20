// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 80;

app.set('view engine', 'ejs'); // set a view wngine
app.use(express.urlencoded({ extended: true })); // Para analisar requisições codificadas em URL "middelware"
app.use(express.json()); // Para analisar requisições JSON "middelware"

const routes = require('./routes/index');
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
