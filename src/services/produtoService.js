import db from '../db/db.js';

// LISTAR E FILTRAR PRODUTOS
export const findAll = async (
  idProduto,
  nomeProduto,
  valorMin,
  valorMax,
  tipo
) => {

  let sql = 'SELECT * FROM produto';

  const conditions = [];
  const values = [];

  if (idProduto) {
    conditions.push('idProduto = ?');
    values.push(idProduto);
  }

  if (nomeProduto) {
    conditions.push('LOWER(nomeProduto) LIKE ?');
    values.push(`%${nomeProduto.toLowerCase()}%`);
  }

  if (tipo) {
    conditions.push('tipo = ?');
    values.push(tipo);
  }

  if (valorMin !== undefined && valorMin !== '') {
    conditions.push('valor >= ?');
    values.push(valorMin);
  }

  if (valorMax !== undefined && valorMax !== '') {
    conditions.push('valor <= ?');
    values.push(valorMax);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY idProduto ASC';

  const [rows] = await db.query(sql, values);

  return rows;
};

// BUSCAR PRODUTO POR ID
export const findById = async (idProduto) => {

  const [rows] = await db.query(
    'SELECT * FROM produto WHERE idProduto = ?',
    [idProduto]
  );

  return rows[0];
};

// CADASTRAR PRODUTO
export const create = async (produtoData) => {

  const novoProduto = {
    nomeProduto: produtoData.nomeProduto,
    descricao: produtoData.descricao,
    tipo: produtoData.tipo,
    valor: produtoData.valor,
    imagem: produtoData.imagem
  };

  const [result] = await db.query(
    'INSERT INTO produto SET ?',
    [novoProduto]
  );

  return {
    idProduto: result.insertId,
    ...novoProduto
  };
};

// ATUALIZAR PRODUTO
export const update = async (idProduto, produtoData) => {

  const [result] = await db.query(
    'UPDATE produto SET ? WHERE idProduto = ?',
    [produtoData, idProduto]
  );

  return result.affectedRows > 0;
};

// DELETAR PRODUTO
export const remove = async (idProduto) => {

  const [result] = await db.query(
    'DELETE FROM produto WHERE idProduto = ?',
    [idProduto]
  );

  return result.affectedRows > 0;
};