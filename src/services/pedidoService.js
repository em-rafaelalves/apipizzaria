import db from '../db/db.js';

// LISTAR E FILTRAR PEDIDOS
export const findAll = async (
  idPedido,
  cpf,
  statusPedido,
  formaPagamento,
  formaEntrega
) => {

  let sql = `
    SELECT
      p.*,
      u.nome AS nomeCliente,
      e.nomeEntregador
    FROM pedido p
    INNER JOIN usuario u ON p.cpf = u.cpf
    INNER JOIN entregador e ON p.idEntregador = e.idEntregador
  `;

  const conditions = [];
  const values = [];

  if (idPedido) {
    conditions.push('p.idPedido = ?');
    values.push(idPedido);
  }

  if (cpf) {
    conditions.push('p.cpf = ?');
    values.push(cpf);
  }

  if (statusPedido) {
    conditions.push('p.statusPedido = ?');
    values.push(statusPedido);
  }

  if (formaPagamento) {
    conditions.push('p.formaPagamento = ?');
    values.push(formaPagamento);
  }

  if (formaEntrega) {
    conditions.push('p.formaEntrega = ?');
    values.push(formaEntrega);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY p.idPedido DESC';

  const [rows] = await db.query(sql, values);

  return rows;
};

// BUSCAR PEDIDO POR ID
export const findById = async (idPedido) => {

  const [pedidos] = await db.query(
    `
      SELECT
        p.*,
        u.nome AS nomeCliente,
        e.nomeEntregador
      FROM pedido p
      INNER JOIN usuario u ON p.cpf = u.cpf
      INNER JOIN entregador e ON p.idEntregador = e.idEntregador
      WHERE p.idPedido = ?
    `,
    [idPedido]
  );

  if (pedidos.length === 0) {
    return null;
  }

  const [itens] = await db.query(
    `
      SELECT
        i.idItem,
        i.qtdeItens,
        i.valorParcial,
        i.idProduto,
        pr.nomeProduto,
        pr.descricao,
        pr.imagem
      FROM itemPedido i
      INNER JOIN produto pr ON i.idProduto = pr.idProduto
      WHERE i.idPedido = ?
    `,
    [idPedido]
  );

  return {
    ...pedidos[0],
    itens
  };
};

// CADASTRAR PEDIDO
export const create = async (pedidoData) => {

  const connection = await db.getConnection();

  try {

    await connection.beginTransaction();

    let valorTotal = 0;

    const itensCalculados = [];

    // BUSCAR PRODUTOS E CALCULAR VALORES
    for (const item of pedidoData.itens) {

      const [produtos] = await connection.query(
        'SELECT idProduto, valor FROM produto WHERE idProduto = ?',
        [item.idProduto]
      );

      if (produtos.length === 0) {
        throw new Error(
          `Produto ${item.idProduto} não encontrado.`
        );
      }

      const valorUnitario = Number(produtos[0].valor);

      const valorParcial = Number(
        (valorUnitario * item.qtdeItens).toFixed(2)
      );

      valorTotal += valorParcial;

      itensCalculados.push({
        idProduto: item.idProduto,
        qtdeItens: item.qtdeItens,
        valorParcial
      });
    }

    valorTotal = Number(valorTotal.toFixed(2));

    // CADASTRAR PEDIDO
    const novoPedido = {
      valorTotal,
      formaPagamento: pedidoData.formaPagamento,
      statusPedido: pedidoData.statusPedido,
      formaEntrega: pedidoData.formaEntrega,
      cpf: pedidoData.cpf,
      idEntregador: pedidoData.idEntregador
    };

    const [result] = await connection.query(
      'INSERT INTO pedido SET ?',
      [novoPedido]
    );

    const idPedido = result.insertId;

    // CADASTRAR ITENS DO PEDIDO
    for (const item of itensCalculados) {

      await connection.query(
        `
          INSERT INTO itemPedido
          (qtdeItens, valorParcial, idProduto, idPedido)
          VALUES (?, ?, ?, ?)
        `,
        [
          item.qtdeItens,
          item.valorParcial,
          item.idProduto,
          idPedido
        ]
      );
    }

    await connection.commit();

    return {
      idPedido,
      ...novoPedido,
      itens: itensCalculados
    };

  } catch (err) {

    await connection.rollback();

    throw err;

  } finally {

    connection.release();

  }
};

// ATUALIZAR PEDIDO
export const update = async (idPedido, pedidoData) => {

  const [result] = await db.query(
    'UPDATE pedido SET ? WHERE idPedido = ?',
    [pedidoData, idPedido]
  );

  return result.affectedRows > 0;
};

// DELETAR PEDIDO
export const remove = async (idPedido) => {

  const connection = await db.getConnection();

  try {

    await connection.beginTransaction();

    // PRIMEIRO EXCLUIR OS ITENS DO PEDIDO
    await connection.query(
      'DELETE FROM itemPedido WHERE idPedido = ?',
      [idPedido]
    );

    // DEPOIS EXCLUIR O PEDIDO
    const [result] = await connection.query(
      'DELETE FROM pedido WHERE idPedido = ?',
      [idPedido]
    );

    await connection.commit();

    return result.affectedRows > 0;

  } catch (err) {

    await connection.rollback();

    throw err;

  } finally {

    connection.release();

  }
};