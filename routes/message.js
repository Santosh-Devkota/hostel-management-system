const express = require("express");
const Router = express.Router()
const { getMessage, postMessage, updateMessage, deleteMessage } = require("../controller/message");

// Router.get("/message/get",getMessage);
// Router.post("/message/add",postMessage);
// Router.put("/message/update/:id",updateMessage);
// Router.delete("/message/delete/:id",deleteMessage);
module.exports = Router