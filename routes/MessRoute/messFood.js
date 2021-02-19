const express = require("express");
const Router = express.Router()
const {addFoodItem,getAllItems,getFoodItemByName,getFoodItemById,updateItem,deleteItem} = require("../../controller/Mess/messFood");

Router.post("/mess/addFoodItem",addFoodItem);
Router.get("/mesh/getallitems",getAllItems);
Router.get("/mesh/searchfoodname/:foodname",getFoodItemByName);
Router.get("/mesh/searchfoodid/:id",getFoodItemById);
Router.put("/mesh/updateItem/:id",updateItem);
Router.delete("/mesh/deleteItem/:id",deleteItem);



module.exports = Router
