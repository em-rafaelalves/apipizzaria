// src/index.js
//Primeira linha do seu projeto. Carrega as variáveis de ambiente antes de qualquer outro código.
import 'dotenv/config';

//Sintaxe de importação para todas as dependências.
import express from 'express';
import helmet from 'helmet'; 
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';


// // //Importando as rotas.
// // Importa as rotas de autenticação
//import authRoutes from './routes/authRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';

 //import produtoRoutes from './routes/produtoRoutes.js';
 //import pedidoRoutes from './routes/pedidoRoutes.js';


// --- CONFIGURAÇÕES ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const corsOptions = {
    origin: ['http://localhost:3333', 'https://meudominio.com'],
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true,
};

// --- INICIALIZAÇÃO DO APP ---
const app = express();

// --- MIDDLEWARES ---
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
//Servindo pasta 'public' para arquivos (CSS, JS, imagens).
app.use(express.static(path.join(__dirname, '..', 'public')));

// --- ROTAS ---
// Rota principal que serve a página HTML.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', 'home.html'));
});

//Rotas da API prefixadas, isso evita conflitos e deixa claro quais rotas pertencem à API.
const apiPrefix = '/api';
// Rotas gerais da API (ex: /api/sandro)
app.use(`${apiPrefix}/clientes`, clienteRoutes); // ex: /api/clientes/
//app.use(`${apiPrefix}/login`, authRoutes); //Rota de login ex:/api/login
//app.use(`${apiPrefix}/produtos`, produtoRoutes); // ex: /api/produtos/
//app.use(`${apiPrefix}/pedidos`, pedidoRoutes);   // ex: /api/pedidos/ (exige token)

// --- TRATAMENTO DE ERROS ---
// Um middleware de erro centralizado.
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado no servidor!');
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});