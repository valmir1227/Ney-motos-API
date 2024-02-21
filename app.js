const express = require("express");
const { MongoClient, ObjectId, ReturnDocument } = require("mongodb");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();
const port = 3000;

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

//  CONECTAR COM O BANCO
const connectToDatabase = async () => {
  await client.connect();
  return client;
};

const closeDatabaseConnection = async (client) => {
  if (client) {
    await client.close();
  }
};

const handleError = (res, statusCode, message) => {
  return res.status(statusCode).send({ message });
};

// alterar para estoque
app.get("/vehicles", async (req, res) => {
  let client;

  try {
    client = await connectToDatabase();

    const database = client.db("Revenda");
    const collection = database.collection("vehicles");

    const { marca, placa, modelo, ano, cor, status, valorMin, valorMax } =
      req.query;

    if (ano && isNaN(parseInt(ano, 10))) {
      return handleError(res, 400, "O ano deve ser um número válido");
    }

    if (
      valorMin &&
      valorMax &&
      isNaN(parseInt(valorMin, 10) || isNaN(parseInt(valorMax, 10)))
    ) {
      return handleError(
        res,
        400,
        "Os valores mínimo e máximo devem ser números válidos"
      );
    }

    const filter = {};

    if (marca) filter.marca = marca;

    if (placa) filter.placa = placa;

    if (modelo) filter.modelo = modelo;

    if (ano) filter.ano = parseInt(ano, 10);

    if (cor) filter.cor = cor;

    if (status) filter.status = status;

    if (valorMin && valorMax) {
      filter.valor_venda = {
        $gte: parseInt(valorMin, 10),
        $lte: parseInt(valorMax, 10),
      };
    }

    const vehicles = await collection.find(filter).toArray();

    if (vehicles.length === 0) {
      return res.status(404).send({ message: "Nenhum veículo encontrado" });
    }
    res.send(vehicles);
  } catch (error) {
    console.log(error);
    handleError(res, 500, "Erro interno do servidor");
  } finally {
    await closeDatabaseConnection(client);
  }
});

// Separar em um função externa
// Usuario nao pode buscar por vendidos(status)
const buildFilter = (query) => {
  const { marca, modelo, ano, cor, status, valorMin, valorMax } = query;

  const filter = {};

  if (marca) filter.marca = marca;
  if (modelo) filter.modelo = modelo;
  if (ano) filter.ano = parseInt(ano, 10);
  if (cor) filter.cor = cor;
  if (status) filter.status = status;

  if (valorMin && valorMax) {
    filter.valor_venda = {
      $gte: parseInt(valorMin, 10),
      $lte: parseInt(valorMax, 10),
    };
  }

  return filter;
};

//Remover 
app.get("/vehicles-available", async (req, res) => {
  let client;

  try {
    client = await connectToDatabase();
    const database = client.db("Revenda");
    const collection = database.collection("vehicles");

    const baseFilter = buildFilter(req.query);

    const filter = { ...baseFilter, status: "Disponível" };

    const vehicles = await collection.find(filter).toArray();

    if (vehicles.length === 0) {
      return res.status(404).send({ message: "Nenhum veículo encontrado" });
    }

    res.send(vehicles);
  } catch (error) {
    console.log(error);
    handleError(res, 500, "Erro interno do servidor");
  } finally {
    await closeDatabaseConnection(client);
  }
});

app.get("/vehicles/:id", async (req, res) => {
  const vehicleId = req.params.id;

  try {
    await client.connect();
    const database = client.db("Revenda");
    const collection = database.collection("vehicles");

    const objectId = ObjectId.isValid(vehicleId)
      ? new ObjectId(vehicleId)
      : vehicleId;

    const vehicle = await collection.findOne({
      _id: objectId,
    });

    if (vehicle) {
      res.json(vehicle);
    } else {
      res.status(404).json({ message: "Veículo não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao acessar o MongoDB:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  } finally {
    await client.close();
  }
});

// converter dados do carro para minusculas antes de salvar no banco
app.post("/vehicles", upload.array("images", 12), async (req, res) => {
  const newVehicle = req.body;
  const images = req.files.map((file) => file.filename);

  if (!newVehicle.placa) {
    return res.status(400).send({ message: "A placa é obrigatória" });
  }

  try {
    await client.connect();
    const database = client.db("Revenda");
    const collection = database.collection("vehicles");

    const existingVehicleId = await collection.findOne({ id: newVehicle.id });
    const existingVehiclePlaca = await collection.findOne({
      placa: newVehicle.placa,
    });

    if (existingVehicleId || existingVehiclePlaca) {
      res.status(400).send({ message: "Veículo já cadastrado" });
    } else {
      newVehicle.images = images;

      const result = await collection.insertOne(newVehicle);
      res.status(201).send({ message: "Veículo adicionado com sucesso" });
    }
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
});

app.put("/vehicles/:id", async (req, res) => {
  const vehicleId = req.params.id;
  const updateVehicleData = req.body;

  try {
    await client.connect();
    const database = client.db("Revenda");
    const collection = database.collection("vehicles");

    const objectId = ObjectId.isValid(vehicleId)
      ? new ObjectId(vehicleId)
      : vehicleId;

    const existingVehicle = await collection.findOne({
      _id: objectId,
    });

    if (!existingVehicle) {
      res.status(404).send({ message: "Veículo não encontrado" });
      return;
    }

    const result = await collection.updateOne(
      { _id: objectId },
      {
        $set: {
          marca: updateVehicleData.marca,
          modelo: updateVehicleData.modelo,
          ano: updateVehicleData.ano,
          quilometragem: updateVehicleData.quilometragem,
          placa: updateVehicleData.placa,
          cor: updateVehicleData.cor,
          valor_compra: updateVehicleData.valor_compra,
          valor_venda: updateVehicleData.valor_venda,
          status: updateVehicleData.status,
          data_compra: updateVehicleData.data_compra,
          data_venda: updateVehicleData.data_venda,
          imagens: updateVehicleData.imagens,
        },
        $push: { gastos: { $each: updateVehicleData.gastos } },
      }
    );

    if (result.modifiedCount > 0) {
      res.send({ message: "Veículo atualizado com sucesso" });
    } else {
      res.send({ message: "Nenhuma alteração realizada" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro interno do servidor");
  } finally {
    await client.close();
  }
});

app.delete("/vehicles/:id", async (req, res) => {
  const vehicleId = req.params.id;

  if (!vehicleId) {
    return;
  }

  try {
    await client.connect();
    const database = client.db("Revenda");
    const collection = database.collection("vehicles");

    const objectId = ObjectId.isValid(vehicleId)
      ? new ObjectId(vehicleId)
      : vehicleId;

    const existingVehicle = await collection.findOne({
      _id: objectId,
    });

    if (!existingVehicle) {
      res.status(404).send({ message: "Veículo não encontrado" });
    }

    const result = await collection.deleteOne({ _id: objectId });

    if (result.deletedCount > 0) {
      res.send({ message: "Veículo excluído com sucesso" });
    } else {
      res.send({ message: "Nenhum veículo excluído" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro interno do servidor");
  } finally {
    await client.close();
  }
});

app.delete("/vehicles/:vehicleId/gastos/:gastoId", async (req, res) => {
  const vehicleId = req.params.vehicleId;
  const gastoId = req.params.gastoId;

  try {
    await client.connect();
    const database = client.db("Revenda");
    const collection = database.collection("vehicles");

    const objectId = ObjectId.isValid(vehicleId)
      ? new ObjectId(vehicleId)
      : vehicleId;

    const existingVehicle = await collection.findOne({
      _id: objectId,
    });

    if (!existingVehicle) {
      res.status(404).send({ message: "Veículo não encontrado" });
      return;
    }

    const gastoIndex = existingVehicle.gastos.findIndex(
      (gasto) => gasto.id === gastoId
    );

    if (gastoIndex === -1) {
      res.status(404).send({ message: "Gasto não encontrado" });
      return;
    }

    existingVehicle.gastos.splice(gastoIndex, 1);

    await collection.updateOne(
      { _id: objectId },
      { $set: { gastos: existingVehicle.gastos } }
    );

    res.send({ message: "Gasto removido" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro interno do servidor");
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log("server is running");
});
