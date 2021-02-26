const express = require("express");
const Router = express.Router()
const {addStudentConsumption, getEnrolledMembers, enrollRemoveFromMess} = require("../../controller/Mess/dailyConsumption")

Router.post("/mess/dailyconsumption",addStudentConsumption)
Router.get("/mess/enrolledmembers/all",getEnrolledMembers);
Router.put("/mess/enrollremove/:rollno",enrollRemoveFromMess);


module.exports = Router

