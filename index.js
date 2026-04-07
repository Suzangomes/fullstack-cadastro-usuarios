require('dotenv').config();

console.log("Arquivo iniciado");

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Consegui conectar ao MongoDB'))
  .catch(erro => console.error('Erro ao conectar no MongoDB:', erro));

const UsuarioSchema = new mongoose.Schema({
  nome: String,
  sobrenome: String,
  email: String,
  senha: String
});

const Usuario = mongoose.model("usuario", UsuarioSchema);

// ROTA DE TESTE
app.get('/', (req, res) => {
  res.send("Servidor está funcionando 🚀");
});

app.post('/cadastro', (req, res) => {

  console.log("BODY RECEBIDO:", req.body);

  const { nome, sobrenome, email, senha } = req.body;

  Usuario.findOne({ email })
    .then(usuarioExistente => {

      if (usuarioExistente) {
        return res.status(400).json({ message: "E-mail já cadastrado." });
      }

      const novoUsuario = new Usuario({ nome, sobrenome, email, senha });

      return novoUsuario.save();
    })
    .then(() => {
      res.status(200).json({ message: "Cadastro realizado com sucesso." });
    })
    .catch(error => {
      console.error("Erro no cadastro:", error);
      res.status(500).json({ message: "Erro no servidor." });
    });

});

// ⬇️ O listen TEM que ficar FORA de tudo
app.listen(3000, () => {
  console.log("API rodando no endereço http://localhost:3000");
});