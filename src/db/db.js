import mysql from 'mysql2/promise';
//criação do pool de conexões 
const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
//função de teset de conexão auto-executável
(async() => {
    try {
        const connection = await db.getConnection();
        console.log('Conexão com o banco de dados estabelecida com sucesso!');
    } catch (err) {
        console.error('Erro ao conectar ao banco ded dados:', err);
    }
})();

//usando 'export default' para executar a instância do pool de conexões.
export default db;