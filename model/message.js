const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId:[{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }],

    receiverId:[{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }],
    date:{
        type:Date,
        default:Date.now
    },
    messageContent:{
        type:String
    },
    replies:[
        {
            type:String
        }
    ]
})

module.exports = mongoose.model("Message",messageSchema);