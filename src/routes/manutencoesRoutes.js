const express = require("express");
const router = express.Router();
const manutencaoController = require("../controllers/manutecaoController");

router.post("/manutencoes", manutencaoController.createManutencao);
router.get("/manutencoes", manutencaoController.getManutencoes);
router.get("/manutencoes/:id", manutencaoController.getManutencaoById);
router.put("/manutencoes/:id", manutencaoController.updateManutencao);
router.delete("/manutencoes/:id", manutencaoController.deleteManutencao);

module.exports = router;
