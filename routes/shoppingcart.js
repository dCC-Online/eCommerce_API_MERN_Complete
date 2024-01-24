const express = require("express");
const router = express.Router();
const {
  validateShoppingCart,
  ShoppingCart,
} = require("../models/shoppingcart");

router.post("/", async (req, res) => {
  try {
    let { error } = validateShoppingCart(req.body);
    if (error) {
      return res.status(400).send("Invalid body for post request!");
    }
    let shoppingCart = new ShoppingCart(req.body);
    shoppingCart.save();
    return res.status(201).send(shoppingCart);
  } catch (error) {
    return res.status(500).send(`Internal Server Error ${error}`);
  }
});

router.get("/:username", async (req, res) => {
  try {
    let username = req.params.username;
    let cartItems = await ShoppingCart.find({ user: username }).populate("product");
    return res.status(200).send(cartItems);
  } catch (er) {
    console.log(er);
    return res.status(500).send(er);
  }
});

module.exports = router;
