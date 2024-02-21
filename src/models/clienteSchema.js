const mongoose = require("mongoose");

const clienteSchema = new mongoose.Schema({
  nome_completo: { type: String, required: true },
  endereco: { type: String },
  numero_telefone: { type: String, required: true },
  email: { type: String, required: true },
  genero: {
    type: String,
    enum: ["Masculino", "Feminino", "Outro"],
    required: true,
  },
  cpf: { type: String },
  rg: { type: String },
  veiculo_comprado: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" }, // Referência ao ID do veículo comprado
});

const Client = mongoose.model("Clients", clienteSchema);

module.exports = Client;
