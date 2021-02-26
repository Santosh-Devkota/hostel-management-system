const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
    category:{
        type:String,
      //  enum:["Curry","Daal","Achar","Extras"],
        required:true
    },
    options:[{type:String}]
})

module.exports = mongoose.model("Menu",menuSchema);