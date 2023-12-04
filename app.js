const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
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

app.get("/vehicles", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("Revenda");
    const collection = database.collection("vehicles");

    const vehicles = await collection.find({}).toArray();
    res.send(vehicles);
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro interno do servidor");
  } finally {
    await client.close();
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
    }

    const result = await collection.updateOne(
      { _id: objectId },
      { $set: updateVehicleData }
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

app.listen(port, () => {
  console.log("server is running");
});
