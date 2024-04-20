const mongoose = require("mongoose");

const vendaSchema = new mongoose.Schema({
  data_venda: { type: Date, default: Date.now },
  valor_venda: { type: Number, required: true },

  moto: {
    type: {
      marca: { type: String, required: true },
      modelo: { type: String, required: true },
      ano_fabricacao: { type: Number, required: true },
      ano_modelo: { type: Number, required: true },
      tipo_moto: { type: String, required: true },
      cor: { type: String, required: true },
      quilometragem: { type: Number, required: true },
      preco: { type: Number, required: true },
      data_entrada: { type: Date, required: true },
      status: {
        type: String,
        required: true,
      },
      capacidade_motor: { type: String },
      tipo_combustivel: { type: String },
      sistema_freios: { type: String },
      imagens: { type: [String], required: true },
    },
    required: true,
  },
});

const Venda = mongoose.model("Venda", vendaSchema);

module.exports = Venda;
