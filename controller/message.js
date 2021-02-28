const Message = require("./../model/message");
const { find, findByIdAndUpdate, findByIdAndDelete } = require("./../model/staff");
const Staffs = require("./../model/staff");
const Student = require("./../model/student")

//route GET /message/get?sender=...&receiver=.....
exports.getMessage = async(req,res)=>{
    try {
        // const {sender,receiver} = req.query;
        // if((sender == "admin") || (sender == "hostelstaff") || (sender == "messstaff") ){
        //     req.body.senderId = req.user._id;//assigning senderId if that sender is from hostel/mess side
        //     req.body.receiverId = receiver;
        // } else if((receiver == "admin") || (receiver == "hostelstaff") || (receiver == "messstaff")){
        //     req.body.senderId = sender;
        //     req.body.receiverId = await Staffs.find({role:receiver}).select("_id").limit(1);
        //     console.log(req.body.receiverId)
        // } else {
        //     res.status(400).json({});
        // }
        const {sender,receiver} = req.query
        const staffRole = ['admin',"hostelstaff","messstaff"];
        if((staffRole.includes(sender) && !staffRole.includes(receiver))){
            req.body.senderId = req.user._id;
            req.body.receiverId = receiver;
        } else if(!staffRole.includes(sender) && staffRole.includes(receiver)){
            req.body.senderId = sender;
            req.body.receiverId = await Staffs.find({role:receiver}).select("_id");
        } else if((staffRole.includes(sender) && staffRole.includes(receiver))){
            req.body.senderId = await Staffs.find({role:sender}).select("_id").limit(1);
            req.body.receiverId =  await Staffs.find({role:receiver}).select("_id").limit(1)
        }else {
            res.status(400).json({});
        }

//// ****************************************
        const messages = await Message.find(
            {
                $and: [
                    {
                      $or: [
                        { senderId: req.body.senderId },
                        { receiverId: req.body.senderId }
                      ]
                    },
                    {
                      $or: [
                        { senderId:req.body.receiverId },
                        { receiverId: req.body.receiverId }
                      ]
                    }
                  ]
            }
        ).sort({"date":1});
        if(!messages){
            return res.status(404).json({msg:"No message found!"})
        }
        res.status(200).json({data:messages})
    } catch (error) {
        console.log(error.message);
        res.status(400).json({msg:"Unable to load message!"});
    }
}

//route Post /message/add?sender=... & receiver=....
exports.postMessage = async(req,res)=>{
    try {
        const {sender,receiver} = req.query
        const staffRole = ['admin',"hostelstaff","messstaff"];
        if((staffRole.includes(sender) && !staffRole.includes(receiver))){
            req.body.senderId = await Staffs.find({role:sender}).select("_id");
            let a= []
            req.body.receiverId = a.push(receiver);
        } else if(!staffRole.includes(sender) && staffRole.includes(receiver)){
            let a= []
            req.body.receiverId = a.push(receiver);
            req.body.senderId = sender;
            req.body.receiverId = await Staffs.find({role:receiver}).select("_id");
        } else if((staffRole.includes(sender) && staffRole.includes(receiver))){
            req.body.senderId = await Staffs.find({role:sender}).select("_id");
            req.body.receiverId =  await Staffs.find({role:receiver}).select("_id")
        }else {
            res.status(400).json({});
        }
        const result = await Message.create(req.body);
        if(!result){
            return res.status(400).json({msg:"Message not sent!"});
        }
        res.status(200).json({msg:"Message sent successfully!"});
    } catch (error) {
        console.log(error.message);
        res.status(400).json({msg:"Message not sent!"});
    }
}

//@route /message/update/:id
exports.updateMessage = async(req,res) =>{
    try {
        var message 
        if(req.body.reply === undefined){
            message = await Message.findByIdAndUpdate(req.params.id,
                {messageContent:req.body.messageContent},
                {new:true,runValidators:true});
        } else if(req.body.reply !== undefined){
            message = await Message.findByIdAndUpdate(req.params.id,
                {messageContent:req.body.messageContent,$push:{ replies: req.body.reply}},
                {new:true,runValidators:true});
        }
        if(!message){
            return res.status(404).json({msg:"message not found!"});
        }
        res.status(200).json({msg:"Message edit successful!"});
    } catch (error) {
        console.log(error.message);
        res.status(400).json({msg:"Couldn't edit message"});
    }
}

// //@route /message/reply/update/:id
// exports.updateReply = async(req,res)=>{
//     try {
        
//     } catch (error) {
        
//     }
// }

//@route /message/delete/reply/:id
exports.deleteReply = async(req,res)=>{
    try {
        const message = await Message.findByIdAndUpdate(req.params.id,{$pull:{ replies: req.body.reply}})
        if(!message){
            return res.status(400).json({msg:"unable to delete the reply"});
        }
        res.status(200).json({msg:"Reply deleted!",data:message});
    } catch (error) {
        console.log(error.message);
        res.status(400).json({msg:"Unable to delete the reply"})
    }

    
    
}

//@route /message/delete/:id
exports.deleteMessage = async(req,res) =>{
    try {
        const message = await Message.findByIdAndDelete(req.params.id);
        if(!message){
            return res.status(404).json({msg:"message not found!"});
        }
        res.status(200).json({msg:"Message delete successful!"});
    } catch (error) {
        console.log(error.message);
        res.status(400).json({msg:"Couldn't delete message!"});
    }
}


