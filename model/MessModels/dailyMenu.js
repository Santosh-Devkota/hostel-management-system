const mongoose = require("mongoose");

const DailyMenuSchema = new mongoose.Schema({
    partOfDay:{
        type:String,
        enum:['morning','evening']
    },
    postedOn:{
        type:Date,
        default:Date.now
    },
    menuList:[
        {
            category:{type:String},
            options:[{type:String}],
        }
    ]
})

module.exports = mongoose.model("DailyMenu",DailyMenuSchema);