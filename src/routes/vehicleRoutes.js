const express = require("express");
const router = express.Router();
const estoqueController = require("../controllers/estoqueController");
const multer = require("multer");
const path = require("path");

// Validar no front para o user enviar no maximo 12 imagens.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, //5MB
});
const uploadArray = upload.array("imagens", 12);

router.post(
  "/estoque",
  (req, res, next) => {
    if (req.files && req.files.length > 12) {
      return res
        .status(400)
        .json({ message: "Você só pode enviar no máximo 12 imagens." });
    }
    next();
  },
  uploadArray,
  estoqueController.createVehicle
);
router.get("/estoque", estoqueController.getEstoque);
router.get("/estoque/:id", estoqueController.getVehicleById);
router.put("/estoque/:id", estoqueController.updateVehicle);
router.delete("/estoque/:id", estoqueController.deleteVehicle);

module.exports = router;
