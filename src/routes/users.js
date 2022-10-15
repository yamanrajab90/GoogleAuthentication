const express = require("express");
const routes = express.Router();

const User = require("../models/User");

// get all users to check
routes.get("/", async (req, res) => {
  const users = await User.find({});
  if (users.length > 0) {
    res.status(200).json(users);
  } else {
    res.status(400).json("users not found");
  }
});

// delete/drop users
routes.delete("/", async (req, res) => {
  await User.deleteMany({});
  res.status(200).json("users deleted successfully");
});

// manually insert user for testing
routes.post("/", async (req, res) => {
  const { email, name, providerId } = req.body;

  const newUser = new User({
    email: email,
    name: name,
    providerId: providerId,
  });

  await newUser.save();
  if (newUser._id) {
    res.status(200).json(newUser);
  } else {
    res.status(404).json({ message: "could not create a user" });
  }
});

module.exports = routes;
