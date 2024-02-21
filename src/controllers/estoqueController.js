const { default: mongoose } = require("mongoose");
const Vehicle = require("../models/estoqueSchema");

exports.createVehicle = async (req, res) => {
  const newVehicleData = req.body;

  try {
    const existingVehicle = await Vehicle.findOne({
      placa: newVehicleData.placa,
    });

    if (existingVehicle) {
      return res.status(400).send({ message: "Veículo já cadastrado" });
    }

    const images = req.files.map((file) => file.filename);

    const newVehicle = new Vehicle({
      marca: newVehicleData.marca,
      modelo: newVehicleData.modelo,
      ano_fabricacao: newVehicleData.ano_fabricacao,
      ano_modelo: newVehicleData.ano_modelo,
      tipo_moto: newVehicleData.tipo_moto,
      cor: newVehicleData.cor,
      placa: newVehicleData.placa,
      quilometragem: newVehicleData.quilometragem,
      preco_venda: newVehicleData.preco_venda,
      preco_compra: newVehicleData.preco_compra,
      data_entrada: newVehicleData.data_entrada,
      data_venda: newVehicleData.data_venda,
      capacidade_motor: newVehicleData.capacidade_motor,
      tipo_combustivel: newVehicleData.tipo_combustivel,
      sistema_freios: newVehicleData.sistema_freios,
      extras: newVehicleData.extras,
      imagens: images,
      descricao: newVehicleData.descricao,
      observacao: newVehicleData.observacao,
      status: newVehicleData.status,
    });

    await newVehicle.save();
    res.status(201).send({ message: "Veículo adicionado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Erro interno do servidor" });
  }
};

exports.getEstoque = async (req, res) => {
  try {
    const { marca, placa, modelo, ano_modelo, cor, valorMin, valorMax } =
      req.query;

    const filter = {};

    if (marca) filter.marca = marca;

    if (placa) filter.placa = placa;

    if (modelo) filter.modelo = modelo;

    if (ano_modelo) filter.ano_modelo = ano_modelo;

    if (cor) filter.cor = cor;

    if (valorMin && valorMax) {
      filter.preco_venda = {
        $gte: parseInt(valorMin),
        $lte: parseInt(valorMax),
      };
    }

    const vehicles = await Vehicle.find(filter);

    if (vehicles.length === 0) {
      return res.status(404).send({ message: "Nenhum veículo encontrado" });
    }

    res.send(vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Erro interno do servidor" });
  }
};

exports.getVehicleById = async (req, res) => {
  const vehicleId = req.params.id;

  try {
    const vehicle = await Vehicle.findById(vehicleId);

    if (vehicle) {
      res.json(vehicle);
    } else {
      res.status(404).json({ message: "Veículo não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao acessar o MongoDB:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

exports.updateVehicle = async (req, res) => {
  const vehicleId = req.params.id;
  const updateVehicleData = req.body;

  try {
    if (!mongoose.isValidObjectId(vehicleId)) {
      return res.status(400).send({ message: "ID de veículo inválido" });
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(vehicleId, {
      $set: {
        marca: updateVehicleData.marca,
        modelo: updateVehicleData.modelo,
        ano_fabricacao: updateVehicleData.ano_fabricacao,
        ano_modelo: updateVehicleData.ano_modelo,
        tipo_moto: updateVehicleData.tipo_moto,
        cor: updateVehicleData.cor,
        placa: updateVehicleData.placa,
        quilometragem: updateVehicleData.quilometragem,
        preco_venda: updateVehicleData.preco_venda,
        preco_compra: updateVehicleData.preco_compra,
        data_entrada: updateVehicleData.data_entrada,
        data_venda: updateVehicleData.data_venda,
        capacidade_motor: updateVehicleData.capacidade_motor,
        tipo_combustivel: updateVehicleData.tipo_combustivel,
        sistema_freios: updateVehicleData.sistema_freios,
        extras: updateVehicleData.extras,
        descricao: updateVehicleData.descricao,
        observacao: updateVehicleData.observacao,
        status: updateVehicleData.status,
        imagens: updateVehicleData.imagens,
      },
    });

    if (updatedVehicle) {
      res.send({ message: "Veículo atualizado com sucesso" });
    } else {
      res.status(404).send({ message: "Veículo não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao atualizar o veículo:", error);
    res.status(500).send({ message: "Erro interno do servidor" });
  }
};

exports.deleteVehicle = async (req, res) => {
  const vehicleId = req.params.id;

  try {
    if (!mongoose.isValidObjectId(vehicleId)) {
      return res.status(400).send({ message: "ID de veículo inválido" });
    }

    const deletedVehicle = await Vehicle.findByIdAndDelete(vehicleId);

    if (deletedVehicle) {
      res.send({ message: "Veículo excluído com sucesso" });
    } else {
      res.status(404).send({ message: "Veículo não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao excluir o veículo:", error);
    res.status(500).send({ message: "Erro interno do servidor" });
  }
};
