require("dotenv").config();
const express = require("express");
const app = express();

const product = require("./routes/product");
const shoppingcart = require("./routes/shoppingcart")

const connectDb = require("./db/db");

connectDb();

app.use(express.json());
app.use("/api/product", product);
app.use("/api/shoppingcart", shoppingcart);

const port = process.env.PORT || 5500;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
