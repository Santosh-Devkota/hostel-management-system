const express = require("express");
const Router = express.Router()
const {addFoodItem,getAllItems,getFoodItemByName,getFoodItemById,updateItem,deleteItem} = require("../../controller/Mess/messFood");

Router.post("/mess/addFoodItem",addFoodItem);
Router.get("/mess/getallitems",getAllItems);
Router.get("/mess/searchfoodname/:foodname",getFoodItemByName);
Router.get("/mess/searchfoodid/:id",getFoodItemById);
Router.put("/mess/updateItem/:id",updateItem);
Router.delete("/mess/deleteItem/:id",deleteItem);



module.exports = Router
