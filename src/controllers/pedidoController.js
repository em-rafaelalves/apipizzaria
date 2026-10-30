import * as pedidoService from '../services/pedidoService.js';
import Joi from 'joi';

// VALIDAÇÃO PARA CADASTRAR PEDIDO
export const pedidoCreateSchema = Joi.object({
  formaPagamento: Joi.string().max(10).required(),

  statusPedido: Joi.string().max(30).required(),

  formaEntrega: Joi.string().max(15).required(),

  cpf: Joi.string().length(11).required(),

  idEntregador: Joi.number().integer().positive().required(),

  itens: Joi.array().items(
    Joi.object({
      idProduto: Joi.number().integer().positive().required(),
      qtdeItens: Joi.number().integer().positive().required()
    })
  ).min(1).required()
});

// VALIDAÇÃO PARA ATUALIZAR PEDIDO
export const pedidoUpdateSchema = Joi.object({
  formaPagamento: Joi.string().max(10),

  statusPedido: Joi.string().max(30),

  formaEntrega: Joi.string().max(15),

  cpf: Joi.string().length(11),

  idEntregador: Joi.number().integer().positive()
}).min(1);

// LISTAR PEDIDOS
export const listarPedidos = async (req, res) => {
  try {
    const {
      idPedido,
      cpf,
      statusPedido,
      formaPagamento,
      formaEntrega
    } = req.query;

    const pedidos = await pedidoService.findAll(
      idPedido,
      cpf,
      statusPedido,
      formaPagamento,
      formaEntrega
    );

    res.status(200).json(pedidos);

  } catch (err) {
    console.error('Erro ao listar pedidos:', err);

    res.status(500).json({
      error: 'Erro ao listar pedidos'
    });
  }
};

// BUSCAR PEDIDO POR ID
export const buscarPedidoPorId = async (req, res) => {
  try {
    const { idPedido } = req.params;

    const pedido = await pedidoService.findById(idPedido);

    if (!pedido) {
      return res.status(404).json({
        error: 'Pedido não encontrado'
      });
    }

    res.status(200).json(pedido);

  } catch (err) {
    console.error('Erro ao buscar pedido:', err);

    res.status(500).json({
      error: 'Erro ao buscar pedido'
    });
  }
};

// CADASTRAR PEDIDO
export const adicionarPedido = async (req, res) => {
  try {
    const novoPedido = await pedidoService.create(req.body);

    res.status(201).json({
      message: 'Pedido cadastrado com sucesso',
      data: novoPedido
    });

  } catch (err) {
    console.error('Erro ao cadastrar pedido:', err);

    if (
      err.code === 'ER_NO_REFERENCED_ROW_2' ||
      err.code === 'ER_NO_REFERENCED_ROW'
    ) {
      return res.status(400).json({
        error: 'CPF, entregador ou produto informado não existe.'
      });
    }

    res.status(500).json({
      error: 'Erro ao cadastrar pedido'
    });
  }
};

// ATUALIZAR PEDIDO
export const atualizarPedido = async (req, res) => {
  try {
    const { idPedido } = req.params;

    const atualizado = await pedidoService.update(
      idPedido,
      req.body
    );

    if (!atualizado) {
      return res.status(404).json({
        error: 'Pedido não encontrado'
      });
    }

    res.status(200).json({
      message: 'Pedido atualizado com sucesso'
    });

  } catch (err) {
    console.error('Erro ao atualizar pedido:', err);

    if (
      err.code === 'ER_NO_REFERENCED_ROW_2' ||
      err.code === 'ER_NO_REFERENCED_ROW'
    ) {
      return res.status(400).json({
        error: 'CPF ou entregador informado não existe.'
      });
    }

    res.status(500).json({
      error: 'Erro ao atualizar pedido'
    });
  }
};

// DELETAR PEDIDO
export const deletarPedido = async (req, res) => {
  try {
    const { idPedido } = req.params;

    const deletado = await pedidoService.remove(idPedido);

    if (!deletado) {
      return res.status(404).json({
        error: 'Pedido não encontrado'
      });
    }

    res.status(200).json({
      message: 'Pedido deletado com sucesso'
    });

  } catch (err) {
    console.error('Erro ao deletar pedido:', err);

    res.status(500).json({
      error: 'Erro ao deletar pedido'
    });
  }
};