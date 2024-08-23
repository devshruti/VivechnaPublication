const mongoose = require("mongoose");
require("dotenv").config()

const connectedDb = mongoose.connect(process.env.MONGO_URI)

//   const connectedDb = mongoose.connection;

//   connectedDb.on("error", (error) => {
//     console.error("MongoDB connection error:", error);
//   });

//   connectedDb.once("open", () => {
//     console.log("Connected to MongoDB");
//   });

module.exports = {
    connectedDb
}