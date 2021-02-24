const express = require("express");
const Router = express.Router()
const {getLatestQuery,getQuery, addNewQuery, updateQuery, deleteQuery} = require("../controller/query");

Router.get("/studentquery/search/latest",getLatestQuery);
Router.get("/studentquery/search",getQuery); // search Query based on query parameter
Router.post("/studentquery/add",addNewQuery);
Router.put("/studentquery/update/:id",updateQuery);
Router.delete("/studentquery/delete/:id",deleteQuery);

module.exports = Router;