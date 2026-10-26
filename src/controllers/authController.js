// src/controllers/authController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as clienteService from '../services/clienteService.js';
export const login = async (req, res) => {
    const { cpf, senha } = req.body;
    try {
        // 1. Verificar se o usuário existe no banco de dados
        const clientes = await clienteService.findAll(cpf);
        const cliente=clientes[0];
       
        if (!cliente) {
            return res.status(401).json({ message: "Credenciais inválidas"});
        }
        // 2. Comparar a senha enviada com o hash salvo no banco
        const senhaValida = await bcrypt.compare(senha, cliente.senha )
        if (!senhaValida) {
            return res.status(401).json({mensage: "Credenciais inválidas"})  
         }
// 3. Gerar o Token JWT
// o `payload` são as informaçoes que queremos guardar no token
const payload = {cpf: cliente.cpf, email: cliente.email};
//o token é assinado com a nossa chave secreta do .env
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: `1h` //Token expira em 1 hora
});

//4. enviar o token para cliente 
res.json({mensage: "login bem-sucedido!", token: token });
} catch (error) {
    console.error(error);
    res.status(500).json({mensage: "Erro interno no servidor."})
  }
};