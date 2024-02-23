const Manutencao = require("../models/manutecaoSchema");
const Estoque = require("../models/estoqueSchema");
const { default: mongoose } = require("mongoose");

exports.createManutencao = async (req, res) => {
  const { data_manutencao, id_moto, tipo_servico, descricao, custo, status } =
    req.body;

  try {
    const motoEstoque = await Estoque.findById(id_moto);

    if (motoEstoque) {
      const manutecao = new Manutencao({
        data_manutencao,
        id_moto,
        tipo_servico,
        descricao,
        custo,
        status,
      });
      await manutecao.save();
      console.log(manutecao);
      res.status(201).json({ message: "Manutencão adicionada" });
    } else {
      res.status(404).json({ message: "Moto não registrada no sistema" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao cadastrar manuteção" });
  }
};

exports.getManutencoes = async (req, res) => {
  try {
    const manutencoes = await Manutencao.find({});

    if (manutencoes.length === 0) {
      return res.status(404).send({ message: "Nenhuma manutenção registrada" });
    }
    res.send(manutencoes);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Erro interno do servidor" });
  }
};

exports.getManutencaoById = async (req, res) => {
  const manutencaoId = req.params.id;

  try {
    const manutencao = await Manutencao.findById(manutencaoId);

    if (manutencao) {
      res.json(manutencao);
    } else {
      res
        .status(404)
        .json({ message: "Registro de manutenção não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao acessar o MongoDB:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

exports.updateManutencao = async (req, res) => {
  const manutencaoId = req.params.id;
  const { data_manutencao, tipo_servico, descricao, custo, status } = req.body;

  try {
    if (!mongoose.isValidObjectId(manutencaoId)) {
      return res.status(400).send({ message: "ID inválido" });
    }

    const updatedManutencao = await Manutencao.findByIdAndUpdate(manutencaoId, {
      $set: {
        data_manutencao,
        tipo_servico,
        descricao,
        custo,
        status,
      },
    });

    if (updatedManutencao) {
      res.send({ message: "Dados atualizados" });
    } else {
      res
        .status(404)
        .send({ message: "Registro de manutenção não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao atualizar dados da manutenção:", error);
    res.status(500).send({ message: "Erro interno do servidor" });
  }
};

exports.deleteManutencao = async (req, res) => {
  const manutecaoId = req.params.id;

  try {
    if (!mongoose.isValidObjectId(manutecaoId)) {
      return res.status(400).send({ message: "ID inválido" });
    }

    const deletedManutencao = await Manutencao.findByIdAndDelete(manutecaoId);

    if (deletedManutencao) {
      res.send({ message: "Manutenção excluída" });
    } else {
      res
        .status(404)
        .send({ message: "Registro de manutenção não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao excluir Manutenção:", error);
    res.status(500).send({ message: "Erro interno do servidor" });
  }
};
