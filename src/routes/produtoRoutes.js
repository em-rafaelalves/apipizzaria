
import express from 'express';

import * as produtoController from '../controllers/produtoController.js';

import validate from '../middlewares/validate.js';

import {
  produtoCreateSchema,
  produtoUpdateSchema
} from '../controllers/produtoController.js';

import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// CADASTRAR PRODUTO
router.post(
  '/',
  validate(produtoCreateSchema),
  produtoController.adicionarProduto
);

// PROTEÇÃO DAS ROTAS ABAIXO
router.use(authMiddleware);

// LISTAR PRODUTOS
router.get(
  '/',
  produtoController.listarProdutos
);

// BUSCAR PRODUTO POR ID
router.get(
  '/:idProduto',
  produtoController.buscarProdutoPorId
);

// ATUALIZAR PRODUTO
router.put(
  '/:idProduto',
  validate(produtoUpdateSchema),
  produtoController.atualizarProduto
);

// DELETAR PRODUTO
router.delete(
  '/:idProduto',
  produtoController.deletarProduto
);

export default router;