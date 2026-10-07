// src/clienteController.js
//Usamos 'import * as' para agrupar todas as exportações do service.
import * as clienteService from '../services/clienteService.js';
import Joi from 'joi';

//Usando 'export const' para criar e exportar a função
//Criação dos Schemas que o validate irá usar para validar dados do usuário
export const clienteCreateSchema = Joi.object({
  cpf: Joi.string().length(11).required(),
  nome: Joi.string().required().max(100),
  endereco: Joi.string().required().max(100),
  bairro: Joi.string().max(30).allow(''),
  cidade: Joi.string().max(30).allow(''),
  cep: Joi.string().required(),
  email: Joi.string().email().required().max(50),
  senha: Joi.string().min(6).required(),
});

export const clienteUpdateSchema = Joi.object({
  nome: Joi.string().max(100),
  endereco: Joi.string().max(100),
  bairro: Joi.string().max(30).allow(''),
  cidade: Joi.string().max(30).allow(''),
  cep: Joi.string(),
  email: Joi.string().email().max(50),
  senha: Joi.string().min(6),
}).min(1);

export const listarClientes = async (req, res) => {
    try {
      // Capturamos os parâmetros de consulta da URL
      // ex: ?cpf=01234567890 / ?nome=sandro / ?email=sandro@senac.br
      const { cpf, nome, email } = req.query;
      // Passamos todos os filtros para o serviço
      const clientes = await clienteService.findAll(cpf, nome, email);
    // Lista vazia é uma resposta válida: 200 com []
      res.json(clientes);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
};


export const adicionarCliente = async (req, res) => {
  try {
    const novoCliente = await clienteService.create(req.body);
    res.status(201).json({ message: 'Cliente adicionado com sucesso', data: novoCliente });
  } catch (err) {
    console.error('Erro ao adicionar cliente:', err);
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'CPF já cadastrado.' });
    }
    res.status(500).json({ error: 'Erro ao adicionar cliente' });
  }
};

export const atualizarCliente = async (req, res) => {
  try {
    const { cpf } = req.params;
    const updated = await clienteService.update(cpf, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.status(200).json({ message: 'Cliente atualizado com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar cliente:', err);
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
};

export const deletarCliente = async (req, res) => {
  try {
    const { cpf } = req.params;
    const deleted = await clienteService.remove(cpf);
    if (!deleted) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.status(200).json({ message: 'Cliente deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar cliente:', err);
    res.status(500).json({ error: 'Erro ao deletar cliente' });
  }
};
