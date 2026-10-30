import express from 'express';

import * as pedidoController from '../controllers/pedidoController.js';

import validate from '../middlewares/validate.js';

import {
  pedidoCreateSchema,
  pedidoUpdateSchema
} from '../controllers/pedidoController.js';

import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// PROTEÇÃO DAS ROTAS
router.use(authMiddleware);

// CADASTRAR PEDIDO
router.post(
  '/',
  validate(pedidoCreateSchema),
  pedidoController.adicionarPedido
);

// LISTAR PEDIDOS
router.get('/', pedidoController.listarPedidos);

// BUSCAR PEDIDO POR ID
router.get(
  '/:idPedido',
  pedidoController.buscarPedidoPorId
);

// ATUALIZAR PEDIDO
router.put(
  '/:idPedido',
  validate(pedidoUpdateSchema),
  pedidoController.atualizarPedido
);

// DELETAR PEDIDO
router.delete(
  '/:idPedido',
  pedidoController.deletarPedido
);

export default router;