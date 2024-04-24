const { mongoose } = require("mongoose");
const Venda = require("../models/vendaSchema");
const Estoque = require("../models/estoqueSchema");

exports.createVenda = async (req, res) => {
  const { id_moto, valor_venda } = req.body;

  try {
    const motoEstoque = await Estoque.findById(id_moto);

    const venda = new Venda({
      data_venda: new Date(),
      valor_venda,
      moto: {
        id_moto: motoEstoque._id,
        marca: motoEstoque.marca,
        status:"Vendido",
        modelo: motoEstoque.modelo,
        ano_fabricacao: motoEstoque.ano_fabricacao,
        ano_modelo: motoEstoque.ano_modelo,
        tipo_moto: motoEstoque.tipo_moto,
        cor: motoEstoque.cor,
        quilometragem: motoEstoque.quilometragem,
        preco: motoEstoque.preco,
        data_entrada: motoEstoque.data_entrada,
        imagens: motoEstoque.imagens,
      },
    });

    await venda.save();
    await Estoque.findByIdAndDelete(id_moto);

    res.status(201).json({ message: "Venda cadastrada com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao cadastrar venda" });
  }
};

exports.getVendas = async (req, res) => {
  try {
    const vendas = await Venda.find({});

    if (vendas.length === 0) {
      return res.status(404).send({ message: "Nenhuma venda registrada" });
    }
    res.send(vendas);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Erro interno do servidor" });
  }
};

exports.getVendaById = async (req, res) => {
  const vendaId = req.params.id;

  try {
    const venda = await Venda.findById(vendaId);

    if (venda) {
      res.json(venda);
    } else {
      res.status(404).json({ message: "Registro de venda não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao acessar o MongoDB:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

exports.deleteVenda = async (req, res) => {
  const vendaId = req.params.id;

  try {
    if (!mongoose.isValidObjectId(vendaId)) {
      return res.status(400).send({ message: "ID inválido" });
    }

    const deletedVenda = await Venda.findByIdAndDelete(vendaId);

    if (deletedVenda) {
      res.send({ message: "Venda excluída" });
    } else {
      res.status(404).send({ message: "Registro de venda não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao excluir Venda:", error);
    res.status(500).send({ message: "Erro interno do servidor" });
  }
};
