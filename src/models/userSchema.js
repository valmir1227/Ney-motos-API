const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    nome: { type: String },
    email: { type: String },
    senha: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("Users", userSchema);

module.exports = User;
