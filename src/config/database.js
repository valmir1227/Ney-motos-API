const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGO_URI;
const connectToDatabase = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};

const closeDatabaseConnection = async () => {
  try {
    await mongoose.connection.close();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error disconnecting from MongoDB", error);
  }
};

module.exports = { connectToDatabase, closeDatabaseConnection };
