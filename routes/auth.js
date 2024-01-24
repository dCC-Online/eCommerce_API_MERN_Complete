const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User, validateUser, validateLogin } = require("../models/user");

//Handles registration POST request
router.post("/register", async (req, res) => {
  //* 1. Validate Request Data ---
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send("Invalid registration data");
  }

  //* 2. Check if user is already registered ---
  let user = await User.findOne({ username: req.body.username });
  if (user) {
    return res.status(400).send("User already registered.");
  }

  const salt = await bcrypt.genSalt(10); // Encryption/Hash Level

  //* 3. Register the user and save to the database ---
  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, salt),
  });
  await user.save();

  //* 4. Generate a JWT with user-specific information using the secret key ---
  const token = user.generateAuthToken();

  //* 5. Include the JWT in the response headers and send user details ---
  res
    .status(201)
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send({ _id: user._id, username: user.username, email: user.email });
});

//* Login POST request route
router.post("/login", async (req, res) => {
  //* 1. Validate Login Data ---
  const { error } = validateLogin(req.body);
  if (error) {
    return res.status(400).send("Invalid Login Data");
  }

  //* 2. Verify if the user exists ---
  let user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(400).send("No user found with provided username");
  }

  //* 3. Validate Password ---
  const validPassword = bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send("Invalid password.");
  }

  //* 4. Generate Authentication Token ---
  const token = user.generateAuthToken();

  //* 5. Send the JWT token as response ---
  res
    .status(201)
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send("Login successful");
});

module.exports = router;
