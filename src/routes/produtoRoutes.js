// src/routes/produtoRoutes.js
import express from 'express';
import * as produtoController from '../controllers/produtoController.js';
import validate from '../middlewares/validate.js';
import { produtoCreateSchema, produtoUpdateSchema } from '../controllers/produtoController.js';

// // 1. Importa o middleware de login. Descomentar para carregar
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// A rota de criação de produto (registro) continua pública
router.post('/', validate(produtoCreateSchema), produtoController.adicionarProduto);// Rota final: POST /api/produtos

// //2. Aplica o proteção do login em todas as rotas abaixo desta linha
router.use(authMiddleware);

// O caminho base '/api/produtos' já foi definido no index.js
// Agora definimos apenas as partes relativas: '/', etc.
router.get('/', produtoController.listarProdutos); // Rota final: GET /api/produtos

router.put('/idProduto', validate(produtoUpdateSchema), produtoController.atualizarProduto); // Rota final: PUT /api/produtos/:idProduto

router.delete('/idProduto', produtoController.deletarProduto); // Rota final: DELETE /api/produtos/:idProduto
export default router;