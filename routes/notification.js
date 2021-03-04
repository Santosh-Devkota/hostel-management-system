const express = require("express");
const Router = express.Router()
const authorize = require("../middleware/authorize");
// const {getLatestNotice, postNotice, updateNotice, deleteNotice} = require("../controller/notice");
const {getLatestNotification, turnOffNotification} = require("../controller/notification");

Router.get("/notification",[authorize],getLatestNotification);
Router.put("/notification/turnoff/:id",[authorize],turnOffNotification);


module.exports = Router