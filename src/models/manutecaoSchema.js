const mongoose = require("mongoose");

const manutencaoSchema = new mongoose.Schema({
  data_manutencao: { type: Date, required: true },
  id_moto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  tipo_servico: { type: String, required: true },
  descricao: { type: String },
  custo: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Concluído", "Pendente"],
    default: "Concluído",
    required: true,
  },
});

const Manutencao = mongoose.model("Manutencao", manutencaoSchema);

module.exports = Manutencao;
