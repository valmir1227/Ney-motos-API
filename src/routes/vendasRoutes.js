const express = require("express");
const router = express.Router();
const vendaController = require("../controllers/vendaController");

router.post("/vendas", vendaController.createVenda);
router.get("/vendas", vendaController.getVendas);
router.get("/vendas/:id", vendaController.getVendaById);
router.put("/vendas/:id", vendaController.updateVenda);
router.delete("/vendas/:id", vendaController.deleteVenda);

module.exports = router;
