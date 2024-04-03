const multer = require("multer");
const path = require("path");

// Validar no front para o user enviar no maximo 12 imagens.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Images");
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

module.exports = uploadArray