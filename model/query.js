const mongoose = require("mongoose");

const studentQuerySchema = new mongoose.Schema({
    studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student",
        required:true
    },
    roomNo:{
        type:String,
        required:true,
    },
    queryTitle:{
        type:String,
        required:true,
        maxlength:20
    },
    queryContent:{
        type:String,
        required:true,
    },
    queryDate:{
        type:Date,
        default:Date.now
    },
    resolveStatus:{
        type:String,
        enum:["Pending","Resolved"],
        default:"Pending"
    }
})

module.exports = mongoose.model("StudentQuery",studentQuerySchema);