const FoodItem = require("../../model/MessModels/foodItem");


//@route Post /mesh/addItem
exports.addFoodItem = async (req, res) => {
  try {
    const resultss = await FoodItem.findOne({foodName:req.body.foodName});
    if(resultss){
        return res.status(404).json({msg:"Item already exists!"})
    }
    const result = await FoodItem.create(req.body);
    if(!result){
        return res.status(400).json({msg:"Unable to create the food item!"});
    }
    res.status(200).json({msg:"Food item created succesfully!",data:result});
  } catch (error) {
      console.log(error.message);
      res.status(400).json({msg:"Unable to create the food item!"});
  }
};

//@route GET /mesh/getallitems
exports.getAllItems = async(req,res)=>{
    try {
        const result = await FoodItem.find().sort({"_id":-1}).limit(10);
        if(result.length ===0){
            return res.status(404).json({msg:"No food items found!"});
        }
        res.status(200).json({data:result})
    } catch (error) {
        console.log(error.message);
        res.status(400).json({})
    }
}

//@route GET /mesh/searchfoodname/:foodname
exports.getFoodItemByName = async(req,res) =>{
    try {
        const result = await FoodItem.findOne({foodName:req.params.foodName});
        if(!result){
            return res.status(404).json({msg:"Item not found!"})
        }
        res.status(200).json({data:result});
    } catch (error) {
        console.log(error.message)
        res.status(400).json({})
    }
}
//@route GET /mesh/searchfoodid/:id
exports.getFoodItemById = async(req,res) =>{
    try {
        const result = await FoodItem.findById(req.params.id);
        if(!result){
            return res.status(404).json({msg:"Item not found!"})
        }
        res.status(200).json({data:result});
    } catch (error) {
        console.log(error.message)
        res.status(400).json({msg:"unable to search food item!"});
    }
}

//@route PUT /mesh/updateItem/:id
exports.updateItem = async(req,res)=>{
    try {
        const result = await FoodItem.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        if(!result){
            return res.status(404).json({msg:"Food item not found!"});
        }
        res.status(200).json({msg:"Update successful!"})
    } catch (error) {
        console.log(error.message);
        res.status(400).json({msg:"Unable to update item!"})
    }
}

//@route DELETE /mesh/deleteItem/:id
exports.deleteItem = async(req,res)=>{
    try {
        const result = await FoodItem.findByIdAndDelete(req.params.id)
        if(!result){
            return res.status(404).json({msg:"No such food item!"});
        }
        res.status(200).json({msg:"Food delete succesful!"})
    } catch (error) {
        console.log(error.message);
        res.status(400).json({msg:"Unable to delete the food!"})
    }
}


