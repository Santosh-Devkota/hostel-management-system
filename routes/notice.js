const express = require("express");
const Router = express.Router()
const {getNotice, postNotice} = require("../controller/notice");

Router.get("/notice",getNotice);
Router.post("/notice",postNotice);

module.exports = Router