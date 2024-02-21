const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");

router.post("/clients", clienteController.createClient);
router.get("/clients", clienteController.getClients);
router.get("/clients/:id", clienteController.getClientById);
router.put("/clients/:id", clienteController.updateClient);
router.delete("/clients/:id", clienteController.deleteClient);

module.exports = router;
