const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = (req, res, next) => {
  bcrypt.hash(req.body.senha, 10, function (err, hashedPass) {
    if (err) {
      res.json({
        error: err,
      });
    }
    let user = new User({
      nome: req.body.nome,
      email: req.body.email,
      senha: hashedPass,
    });

    user
      .save()
      .then((user) => {
        res.json({
          message: "Usuario adicionado com sucesso!",
        });
      })
      .catch((error) => {
        res.json({
          message: "Ocorreu um erro!",
        });
      });
  });
};

const login = (req, res, next) => {
  var email = req.body.email;
  var senha = req.body.senha;

  User.findOne({ email }).then((user) => {
    if (user) {
      bcrypt.compare(senha, user.senha, function (err, result) {
        if (err) {
          res.json({
            error: err,
          });
        }
        if (result) {
          let token = jwt.sign({ email: user.email }, "secretValue", {
            expiresIn: "1h",
          });
          res.json({
            message: "Logado com sucesso!",
            token,
          });
        } else {
          res.json({
            message: "Email ou senha incorreto.",
          });
        }
      });
    } else {
      res.json({
        message: "Usuário não encontrado!",
      });
    }
  });
};

module.exports = {
  register,
  login,
};
