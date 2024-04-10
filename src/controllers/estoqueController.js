const { default: mongoose } = require("mongoose");
const Vehicle = require("../models/estoqueSchema");

exports.createVehicle = async (req, res) => {
  try {
    const newVehicleData = req.body;
    const imagePaths = req.files.map((file) => file.path);

    const newVehicle = new Vehicle({
      marca: newVehicleData.marca,
      modelo: newVehicleData.modelo,
      ano_fabricacao: newVehicleData.ano_fabricacao,
      ano_modelo: newVehicleData.ano_modelo,
      tipo_moto: newVehicleData.tipo_moto,
      cor: newVehicleData.cor,
      quilometragem: newVehicleData.quilometragem,
      preco: newVehicleData.preco,
      capacidade_motor: newVehicleData.capacidade_motor,
      tipo_combustivel: newVehicleData.tipo_combustivel,
      sistema_freios: newVehicleData.sistema_freios,
      imagens: imagePaths,
      status: newVehicleData.status,
    });

    await newVehicle.save();
    res.status(201).send({ message: "Veículo cadastrado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Erro interno do servidor" });
  }
};

exports.getEstoque = async (req, res) => {
  try {
    const { marca, tipo_moto, valorMin, valorMax, anoMax, search } = req.query;

    const filter = {};

    if (marca) filter.marca = marca;

    if (tipo_moto) filter.tipo_moto = tipo_moto;

    if (anoMax) {
      filter.ano_modelo = {
        $lte: parseInt(anoMax),
      };
    }

    if (valorMin && valorMax) {
      filter.preco_venda = {
        $gte: parseInt(valorMin),
        $lte: parseInt(valorMax),
      };
    }

    if (search) {
      filter.$or = [
        { marca: { $regex: search, $options: "i" } },
        { modelo: { $regex: search, $options: "i" } },
        { tipo_moto: { $regex: search, $options: "i" } },
      ];
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

//Verificar se o update nao vai com campos vazios
//(deve manter os campos que nao foram alterados)
//uma estrategia é usar o front end para manter os estados
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
        quilometragem: updateVehicleData.quilometragem,
        preco: updateVehicleData.preco,
        capacidade_motor: updateVehicleData.capacidade_motor,
        tipo_combustivel: updateVehicleData.tipo_combustivel,
        sistema_freios: updateVehicleData.sistema_freios,
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
