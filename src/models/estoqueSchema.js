const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  marca: {
    type: String,
    enum: [
      "Honda",
      "Yamaha",
      "Suzuki",
      "Kawasaki",
      "Harley-Davidson",
      "BMW",
      "Dafra",
      "Shineray",
      "Outro",
    ],
    required: true,
  },
  modelo: { type: String, required: true },
  ano_fabricacao: { type: Number, required: true },
  ano_modelo: { type: Number, required: true },
  tipo_moto: {
    type: String,
    enum: [
      "esportiva",
      "cruiser",
      "touring",
      "off road",
      "scooter",
      "street",
      "naked",
      "trail",
      "big trail",
      "custom",
      "touring",
      "outro",
    ],
    required: true,
  },
  cor: { type: String, required: true },
  placa: { type: String, required: true, unique: true },
  quilometragem: { type: Number, required: true },
  preco_venda: { type: Number, required: true },
  preco_compra: { type: Number, required: true },
  data_entrada: { type: Date, default: Date.now },
  data_venda: { type: Date },
  capacidade_motor: { type: String },
  tipo_combustivel: { type: String },
  sistema_freios: { type: String },
  extras: { type: [String] }, // Pode ser um array de strings para armazenar acessórios adicionais
  descricao: { type: String },
  observacao: { type: String },
  status: {
    type: String,
    enum: ["Disponivel", "Reservado"],
    default: "Disponivel",
    required: true,
  },
  imagens: { type: [String], required: true }, // Array de URLs das imagens
});

const Vehicle = mongoose.model("estoque", vehicleSchema, "estoque");

module.exports = Vehicle;
