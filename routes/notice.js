const express = require("express");
const Router = express.Router()
const authorize = require("../middleware/authorize");
const {getLatestNotice, postNotice, updateNotice, deleteNotice} = require("../controller/notice");

Router.get("/notice/search/latest",[authorize],getLatestNotice);
Router.post("/notice/add",[authorize],postNotice);
Router.put("/notice/update/:id",[authorize],updateNotice);
Router.delete("/notice/delete/:id",[authorize],deleteNotice);

module.exports = Router