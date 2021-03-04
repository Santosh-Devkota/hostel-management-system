const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId:{
        type:String,
        required:true
    },

    receiverId:{
        type:String,
        required:true
    },
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