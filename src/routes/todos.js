const express = require("express");
const routes = express.Router();

const Todo = require("../models/Todo");
const { checkAuth } = require("../middleware/validation");

// get todo by this user
routes.get("/", checkAuth, async (req, res) => {
  const userTodo = await Todo.find({ user: req.user.id });

  if (userTodo.length > 0) {
    res.status(200).json(userTodo);
  } else {
    res.status(422).json("user todo not found");
  }
});

// update this user's todo
routes.put("/:id", checkAuth, async (req, res) => {
  const todoID = req.params.id;
  const { text, done } = req.body;
  const todo = await Todo.findById(todoID);

  if (todo) {
    if (todo.user.toString() !== req.user.id) {
      res.status(401).json(todo);
    } else {
      todo.text = !isEmpty(text) ? text : todo.text;
      todo.done = !isEmpty(done) ? done : todo.done;
      await Todo.updateOne({ _id: todoID }, todo);
      res.status(200).json(todo);
    }
  } else {
    res.status(422).json("todo not found");
  }
});

// delete this users's todo
routes.delete("/:id", checkAuth, async (req, res) => {
  const todoID = req.params.id;
  const todo = await Todo.findById(todoID);

  if (todo) {
    if (todo.user.toString() !== req.user.id) {
      res.status(401).json(todo);
    } else {
      await Todo.findByIdAndDelete(todoID);
      res.status(204).json(todo);
    }
  } else {
    res.status(422).json("todo not found");
  }
});

// add todo to this user
routes.post("/", checkAuth, async (req, res) => {
  const { text } = req.body;

  try {
    const newTodo = new Todo({
      text: text,
      user: req.user.id,
    });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(422).json(error);
  }
});

const isEmpty = (field) => {
  if (field) {
    return false;
  } else {
    return true;
  }
};

module.exports = routes;
