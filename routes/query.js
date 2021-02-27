const express = require("express");
const Router = express.Router()
const {getLatestQuery,getQuery, addNewQuery, updateQuery, deleteQuery, getMyQueries} = require("../controller/query");
const authorize = require("../middleware/authorize");

Router.get("/studentquery/search/latest",[authorize],getLatestQuery);
Router.get("/studentquery/search",[authorize],getQuery); // search Query based on query parameter
Router.get("/studentquery/search/myqueries",[authorize],getMyQueries);
Router.post("/studentquery/add",[authorize],addNewQuery);
Router.put("/studentquery/update/:id",[authorize],updateQuery);
Router.delete("/studentquery/delete/:id",[authorize],deleteQuery);

module.exports = Router;