const DailyMenu = require("../../model/MessModels/menu");


//@route /mess/dailymenu/addcategory
exports.addMenuCategory = async(req,res)=>{
    try {
        const result = await DailyMenu.create(req.body)
        if(!result){
            return res.status(404).json({msg:"Unable to add category!"})
        }
        res.status(200).json({msg:"Category added!",data:result});
    } catch (error) {
        console.log(error.message);
        res.status(404).json({msg:"unable to add category!"});
    }
}

//@route //m