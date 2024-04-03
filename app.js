const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const {
  connectToDatabase,
  closeDatabaseConnection,
} = require("./src/config/database");

const estoqueRoutes = require("./src/routes/estoqueRoutes");
const clientsRoutes = require("./src/routes/clientsRoutes");
const vendasRoutes = require("./src/routes/vendasRoutes");
const manutencoesRoutes = require("./src/routes/manutencoesRoutes");

const app = express();
app.use(bodyParser.json());
connectToDatabase();

app.use(estoqueRoutes);
app.use("/uploads", express.static("uploads"))
//app.use(clientsRoutes);
//app.use(vendasRoutes);
//app.use(manutencoesRoutes);

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
process.on("SIGINT", async () => {
  await closeDatabaseConnection();
  process.exit();
});
//=====================================
