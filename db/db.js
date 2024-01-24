const mongoose = require("mongoose");

const connectDb = () => {
    mongoose.set("strictQuery", true);
    mongoose
      .connect(process.env.CONNECTION_STRING)
      .then(() => console.log("Connected to MongoDb..."))
      .catch((err) => {
        console.log(`Could not connect to MongoDb. Error: ${err}`);
        process.exit(1);
      });
  };
  
  module.exports = connectDb;
  