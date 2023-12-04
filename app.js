const express = require("express");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
const bodyParser = require("body-parser");
require("dotenv").config();
const port = 3000;

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

app.use(bodyParser.json());
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

app.post("/vehicles", async (req, res) => {
  const newVehicle = req.body;

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
      const result = await collection.insertOne(newVehicle);
      res.status(201).send({ message: "Veículo adicionado com sucesso" });
    }
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
});

app.put("/vehicles:id", async (req, res) => {
  const vehicleId = req.params.id;
  const updateVehicleData = req.body;

  try {
    await client.connect();
    const database = client.db("Revenda");
    const collection = database.collection("vehicles");

    const existingVehicle = await collection.findOne({
      _id: ObjectId(vehicleId),
    });

    if (!existingVehicle) {
      res.status(404).send({ message: "Veículo não encontrado" });
    }

    const result = await collection.updateOne(
      { _id: ObjectId(vehicleId) },
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

app.listen(port, () => {
  console.log("server is running");
});
