const express = require("express");
const Router = express.Router()
const {getLatestNotice, postNotice, updateNotice, deleteNotice} = require("../controller/notice");

Router.get("/notice/search/latest",getLatestNotice);
Router.post("/notice/add",postNotice);
Router.put("/notice/update/:id",updateNotice);
Router.delete("/notice/delete/:id",deleteNotice);

module.exports = Router