const mongoose = require("mongoose");

const vendaSchema = new mongoose.Schema({
  id_cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clients",
    required: true,
  },
  moto: {
    type: {
      marca: { type: String, required: true },
      modelo: { type: String, required: true },
      ano_fabricacao: { type: Number, required: true },
      ano_modelo: { type: Number, required: true },
      tipo_moto: { type: String, required: true },
      cor: { type: String, required: true },
      quilometragem: { type: Number, required: true },
      preco_compra: { type: Number, required: true },
      data_entrada: { type: Date, required: true },
      capacidade_motor: { type: String },
      tipo_combustivel: { type: String },
      sistema_freios: { type: String },
      extras: { type: [String] },
      descricao: { type: String },
      observacao: { type: String },
      status: { type: String, required: true },
      imagens: { type: [String], required: true },
    },
    required: true,
  },
  data_venda: { type: Date, default: Date.now },
  valor_venda: { type: Number, required: true },
  forma_pagamento: { type: String, required: true },
  status: {
    type: String,
    enum: ["Concluída", "Pendente", "Cancelada", "Parcelado"],
    default: "Concluída",
  },
});

const Venda = mongoose.model("Venda", vendaSchema);

module.exports = Venda;
