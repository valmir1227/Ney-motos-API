const express = require("express");
const router = express.Router();
const vendaController = require("../controllers/vendaController");
const authenticate = require("../midleware/authenticate");

router.post("/vendas", authenticate, vendaController.createVenda);
router.get("/vendas", authenticate, vendaController.getVendas);
router.get("/vendas/:id", authenticate, vendaController.getVendaById);
router.delete("/vendas/:id", authenticate, vendaController.deleteVenda);

module.exports = router;
