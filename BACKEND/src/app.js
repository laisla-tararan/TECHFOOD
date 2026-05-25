const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./routes'); 
const path = require('path') // Manipula os diretórios.

// Middlewares globais
app.use(cors()); // Habilita o CORS para permitir requisições do frontend
app.use(express.json());

// Registro de todas as rotas da API centralizadas
app.use('/', routes);

app.use('/uploads', express.static(path.join(__dirname, '../../uploads')))

module.exports = app;