import * as produtoService from '../services/produtoService.js';
import Joi from 'joi';

// VALIDAÇÃO PARA CADASTRAR PRODUTO
export const produtoCreateSchema = Joi.object({
  nomeProduto: Joi.string().max(25).required(),
  descricao: Joi.string().max(100).required(),
  tipo: Joi.string().max(15).required(),
  valor: Joi.number().positive().required(),
  imagem: Joi.string().max(100).allow('').required()
});

// VALIDAÇÃO PARA ATUALIZAR PRODUTO
export const produtoUpdateSchema = Joi.object({
  nomeProduto: Joi.string().max(25),
  descricao: Joi.string().max(100).allow(''),
  tipo: Joi.string().max(15),
  valor: Joi.number().positive(),
  imagem: Joi.string().max(100).allow('')
}).min(1);

// LISTAR PRODUTOS
export const listarProdutos = async (req, res) => {
  try {
    const {
      idProduto,
      nomeProduto,
      tipo,
      valorMin,
      valorMax
    } = req.query;

    const produtos = await produtoService.findAll(
      idProduto,
      nomeProduto,
      valorMin,
      valorMax,
      tipo
    );

    res.status(200).json(produtos);

  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    res.status(500).json({
      error: 'Erro interno ao buscar produtos'
    });
  }
};

// BUSCAR PRODUTO POR ID
export const buscarProdutoPorId = async (req, res) => {
  try {
    const { idProduto } = req.params;

    const produto = await produtoService.findById(idProduto);

    if (!produto) {
      return res.status(404).json({
        error: 'Produto não encontrado'
      });
    }

    res.status(200).json(produto);

  } catch (err) {
    console.error('Erro ao buscar produto:', err);
    res.status(500).json({
      error: 'Erro ao buscar produto'
    });
  }
};

// ADICIONAR PRODUTO
export const adicionarProduto = async (req, res) => {
  try {
    const novoProduto = await produtoService.create(req.body);

    res.status(201).json({
      message: 'Produto adicionado com sucesso',
      data: novoProduto
    });

  } catch (err) {
    console.error('Erro ao adicionar produto:', err);

    res.status(500).json({
      error: 'Erro ao adicionar produto'
    });
  }
};

// ATUALIZAR PRODUTO
export const atualizarProduto = async (req, res) => {
  try {
    const { idProduto } = req.params;

    const updated = await produtoService.update(
      idProduto,
      req.body
    );

    if (!updated) {
      return res.status(404).json({
        error: 'Produto não encontrado'
      });
    }

    res.status(200).json({
      message: 'Produto atualizado com sucesso'
    });

  } catch (err) {
    console.error('Erro ao atualizar produto:', err);

    res.status(500).json({
      error: 'Erro ao atualizar produto'
    });
  }
};

// DELETAR PRODUTO
export const deletarProduto = async (req, res) => {
  try {
    const { idProduto } = req.params;

    const deleted = await produtoService.remove(idProduto);

    if (!deleted) {
      return res.status(404).json({
        error: 'Produto não encontrado'
      });
    }

    res.status(200).json({
      message: 'Produto deletado com sucesso'
    });

  } catch (err) {
    console.error('Erro ao deletar produto:', err);

    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        error: 'Não é possível excluir este produto porque ele está vinculado a um pedido.'
      });
    }

    res.status(500).json({
      error: 'Erro ao deletar produto'
    });
  }
};