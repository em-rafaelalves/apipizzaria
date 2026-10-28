// src/services/produtoServices.js
import db from '../db/db.js';
import bcrypt from 'bcrypt';

export const findAll = async (idProduto, nomeProduto, valorMin, valorMax, tipo) => {
  // 1. Define a consulta SQL base
  let sql = 'SELECT * FROM produto';
  // 2. Cria um array para as condições WHERE
  const conditions = [];
  // 3. Cria um array para os valores (para prevenir SQL Injection)
  const values = [];
  // 4. Adiciona as condições dinamicamente
  // Adicionamos o filtro de CPF
  if (idProduto) {
    conditions.push('idProduto = ?');
    values.push(idProduto);
  }
  // Adicionamos o filtro de nome
  if (nomeProduto) {
    conditions.push('LOWER(nomeProduto) LIKE ?');
    values.push(`%${nomeProduto.toLowerCase()}%`);
  }
  // Adicionamos o filtro de email
  if (tipo) {
    conditions.push('tipo = ?');
    values.push(tipo);
  }

  if(valorMin){
    conditions.push('valor >= ?');
    values.push(valorMin);
  }
  if(valorMax){
    conditions.push('valor <= ?');
    values.push(valorMax);
  }
  // 5. Se houver condições, anexa elas à consulta SQL
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  // 6. Executa a consulta final
  const [rows] = await db.query(sql, values);
  return rows;

};


export const create = async (clienteData) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(clienteData.senha, saltRounds);

  const newProduto = {
    ...clienteData,
    senha: hashedPassword,
    tipo: 'cliente',
  };

  await db.query('INSERT INTO produto SET ?', newProduto);

  delete newProduto.senha;
  return newProduto;
};

export const update = async (idProduto, clienteData) => {
  if (clienteData.senha) {
    const saltRounds = 10;
    clienteData.senha = await bcrypt.hash(clienteData.senha, saltRounds);
  }
  const [result] = await db.query('UPDATE produto SET ? WHERE idProduto = ?', [clienteData, idProduto]);
  return result.affectedRows > 0;
};

export const remove = async (idProduto) => {
  const [result] = await db.query('DELETE FROM produto WHERE idProduto = ?', [idProduto]);
  return result.affectedRows > 0;
};