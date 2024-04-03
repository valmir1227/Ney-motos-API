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
  quilometragem: { type: Number, required: true },
  preco: { type: Number, required: true },
  data_entrada: { type: Date, default: Date.now },
  capacidade_motor: { type: String },
  tipo_combustivel: { type: String },
  sistema_freios: { type: String },
  status: {
    type: String,
    enum: ["Disponivel", "Reservado", "Vendido"],
    default: "Disponivel",
    required: true,
  },
  imagens: { type: [String], required: true }, // Array de URLs das imagens
});

const Vehicle = mongoose.model("estoque", vehicleSchema, "estoque");

module.exports = Vehicle;
