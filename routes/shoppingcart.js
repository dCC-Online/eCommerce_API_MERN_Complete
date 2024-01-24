const express = require("express");
const router = express.Router();
const {
  validateShoppingCart,
  ShoppingCart,
} = require("../models/shoppingcart");
const { auth } = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    let data = {
      user: req.user._id,
      product: req.body.product
    }
    let { error } = validateShoppingCart(data);
    if (error) {
      return res.status(400).send("Invalid body for post request!");
    }
    
    let shoppingCart = new ShoppingCart(data);
    await shoppingCart.save();
    res.status(201).send(shoppingCart);
  } catch (error) {
    res.status(500).send(`Internal Server Error ${error}`);
  }
});



router.get("/", auth, async (req, res) => {
  try {
    let user = req.user._id;
    let cartItems = await ShoppingCart.find({ user: user }).populate(
      "product"
    );
    res.status(200).send(cartItems);
  } catch (er) {
    console.log(er);
    res.status(500).send(er);
  }
});

module.exports = router;
