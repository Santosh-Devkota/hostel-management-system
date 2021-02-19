const express = require("express");
const Router = express.Router()
const {addStudentConsumption} = require("../../controller/Mess/dailyConsumption")

Router.post("/mesh/dailyconsumption",addStudentConsumption)



module.exports = Router