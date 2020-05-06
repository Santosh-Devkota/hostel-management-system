const express = require("express");
const path = require("path");

const Router = express.Router();
Router.get("/home", (req, res, next) => {
  res.status(200).render(path.join(__dirname, "../", "../views", "index"));
});

module.exports = Router;
