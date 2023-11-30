const conn = require("../db/conn");
const bcrypt = require("bcrypt");
const  jwt = require('jsonwebtoken')

const read = (request, response) => {
  conn("tab_users")
    .select("id", "nome", "email")
    .then((users) => {
      response.status(201).json(users);
    })
    .catch((error) =>
      response
        .status(500)
        .json({ error: "Não foi possível recuperar a lista de usuários" })
    );
};

const create = async (request, response) => {
  const { nome, email, senha } = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(senha, saltRounds);

  let errors = [];

  if (!nome) {
    errors.push({ error: "Nome não fornecido" });
  }

  if (!email) {
    errors.push({ error: "Email não fornecido" });
  }

  if (!senha) {
    errors.push({ error: "Número não fornecido" });
  }

  if (errors.length > 0) {
    return response.status(400).json(errors);
  }

  conn("tab_users")
    .insert({
      nome,
      email,
      senha: passwordHash,
    })
    .then(() => {
      response.json({ msg: "Cadastro realizado com sucesso!" });
    })
    .catch((error) => {
      response.status(500).json({
        error: "Erro ao cadastrar usuário!",
      });
    });
};

function login(req, res) {
  const { email, senha } = req.body;
  conn("tab_users")
    .first()
    .where({ email: email })
    .then((user) => {
      if (user != undefined) {
        const correct = bcrypt.compareSync(senha, user.senha);
        if (correct) {
          const userForToken = {
            email: user.email,
            id: user.id,
          };

          // o token expira em uma hora (60*60 segundos)
          const token = jwt.sign(userForToken, "Meu segredo", {
            //process.env.SECRET
            expiresIn: 60 * 60,
          });
          const dataUser = {
            id: user.id,
            nome: user.nome,
            email: user.email,
          };
          res.send({ token, dataUser });
        } else {
          res.status(401).json({ err: "Usuário ou senha incorreto" });
        }
      } else {
        res.status(401).json({ err: "Usuário ou senha incorreto" });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ err: "Ocorreu algum problema, por favor tente mais tarde!" });
    });
}

module.exports = { create, read, login };
