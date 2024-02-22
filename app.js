const express = require("express");
const bodyParser = require("body-parser");
const {
  connectToDatabase,
  closeDatabaseConnection,
} = require("./src/config/database");

const vehicleRoutes = require("./src/routes/vehiclesRoutes");
const clientsRoutes = require("./src/routes/clientsRoutes");
const vendasRoutes = require("./src/routes/vendasRoutes");

require("dotenv").config();
const app = express();
app.use(bodyParser.json());
connectToDatabase();

app.use(vehicleRoutes);
app.use(clientsRoutes);
app.use(vendasRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
process.on("SIGINT", async () => {
  await closeDatabaseConnection();
  process.exit();
});
//=====================================
