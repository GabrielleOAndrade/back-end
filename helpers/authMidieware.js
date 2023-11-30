const jwt = require("jsonwebtoken");
const conn = require("../db/conn");

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Token de atutenticação não fornecido" });
  }

  jwt.verify(token.split(" ")[1], "Meu segredo", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido" });
    }

    const userId = decoded.id;

    conn("tab_users")
      .first()
      .where({ id: userId })
      .then((user) => {
        if (!user) {
          return res.status(401).json({ message: "Usuário não encontrado" });
        }

        req.user = user;
        next();
      })
      .catch((error) => {
        console.error("Erro ao verificar usuário:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
      });
  });
};

module.exports = { authMiddleware };
