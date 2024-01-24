const express = require("express");
const router = express.Router();
const { validateProduct } = require("../models/product");
const { Product } = require("../models/product");

router.get("/", async (req, res) => {
  try {
    let products = await Product.find();
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(`Internal Server Error ${error}`);
  }
});

router.get("/:id", async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send("No Product Found");
    }
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(`Internal Server Error ${error}`);
  }
});

router.post("/", async (req, res) => {
  try {
    let { error } = validateProduct(req.body);
    if (error) {
      return res.status(400).send("Invalid body for post request!");
    }
    let product = new Product(req.body);
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(500).send(`Internal Server Error ${error}`);
  }
});

router.put("/:id", async (req, res) => {
  try {
    let { error } = validateProduct(req.body);
    if (error) {
      return res.status(400).send("Invalid body for post request!");
    }
    let product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true});
    await product.save();
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(`Internal Server Error ${error}`);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).send(`Product with id of ${req.params.id} deleted!`);
  } catch (error) {
    res.status(500).send(`Internal Server Error ${error}`);
  }
});

module.exports = router;
