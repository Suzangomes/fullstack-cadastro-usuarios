// 🔐 Carregar variáveis de ambiente
require('dotenv').config();

// 📦 Importações
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 🚀 Inicializar app
const app = express();

// 🔧 Middlewares
app.use(express.json());
app.use(cors());

// 🌐 Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado ao MongoDB'))
  .catch(erro => console.error('❌ Erro ao conectar no MongoDB:', erro));

// 📄 Schema do usuário
const UsuarioSchema = new mongoose.Schema({
  nome: String,
  sobrenome: String,
  email: String,
  senha: String
});

// 📦 Model
const Usuario = mongoose.model("usuario", UsuarioSchema);

// 🧪 Rota de teste
app.get('/', (req, res) => {
  res.send("Servidor está funcionando 🚀");
});

// 📝 Rota de cadastro
app.post('/cadastro', async (req, res) => {
  try {
    console.log("📥 BODY RECEBIDO:", req.body);

    const { nome, sobrenome, email, senha } = req.body;

    // 🔎 Validação básica
    if (!nome || !sobrenome || !email || !senha) {
      return res.status(400).json({ message: "Preencha todos os campos." });
    }

    // 🔍 Verifica se já existe
    const usuarioExistente = await Usuario.findOne({ email });

    if (usuarioExistente) {
      return res.status(400).json({ message: "E-mail já cadastrado." });
    }

    // 💾 Salvar usuário
    const novoUsuario = new Usuario({ nome, sobrenome, email, senha });
    await novoUsuario.save();

    res.status(200).json({ message: "Cadastro realizado com sucesso." });

  } catch (error) {
    console.error("🔥 ERRO COMPLETO:", error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
});

// 🚀 Iniciar servidor
app.listen(3000, () => {
  console.log("🚀 API rodando em http://localhost:3000");
});