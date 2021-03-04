//mdfldjfdlkfjdkfld
const Query = require("../model/query");
const Notification = require("../model/notification");
const Student = require("../model/student");
const Staffs = require("../model/staff");

//@route POST /studentquery/add
exports.addNewQuery = async(req,res)=>{
    try {
        req.body.studentId = req.user._id;
        console.log(req.user)
        const result = await Query.create(req.body);
        if(!result){
            return res.status(404).json({msg:"Couldn't add the query!"});
        }
        /////////////////////////
        var notification ={};
        notification.contentId = result._id;
        notification.title = `${req.user.fullName} added a new query! `;
        notification.notificationOf = "query";
        const result1 = await Notification.create(notification);
        if(result1){
          const result2 = await Student.updateMany({},{hasNotification:true});
          const result3 = await Staffs.updateMany({},{hasNotification:true});
        }
        // console.log(result1);
        /////////////////////////////////////
        res.status(200).json({msg:"Query added successfully!",data:result});
    } catch (error) {
        console.log(error.message);
        res.status(404).json({msg:"Couldn't add the query"});
    }
}

//@route GET /studentquery/search/latest
exports.getLatestQuery = async (req, res, next) => {
    try {
      const result = await Query.find().populate("studentId fullName").sort({"_id":-1});
      if (result.length === 0) {
        return res.status(200).json({msg:"No queries added yet!"})
      }
      res.status(200).json({
        data: result,
      });
    } catch (error) {
      console.log(error.message)
      res.status(400).json({msg:"Couldn't show Queries!"})
    }
  };

  //@route GET /studentquery/search/myqueries
  exports.getMyQueries = async(req,res) =>{
    try {
      const result = await Query.find({studentId:req.user._id}).populate("studentId fullName").sort({"_id":-1});
      if(result.length === 0 ){
        return res.status(200).json({msg:"No Queries found!"});
      }
      res.status(200).json({data:result});
    } catch (error) {
      console.log(error.message);
      res.status(404).json({msg:"Couldn't show the Queries!"});
    }
  }
  
//@route GET /studentquery/search?query.....
// resolveStatus = pending/resolved
exports.getQuery = async (req, res, next) => {
    try {
      const {resolveStatus} = req.query;
      var search = {};
      search.resolveStatus = resolveStatus;
      const result = await Query.find(search).populate("studentId fullName").sort({"_id":-1});
      if (result.length === 0) {
        return res.status(404).json({msg:"No Queries to show!"})
      }
      res.status(200).json({
        data: result,
      });
    } catch (error) {
      console.log(error.message)
      res.status(400).json({msg:"Couldn't show Queries!"})
    }
  };
  

  //@route PUT /studentquery/update/:id
  exports.updateQuery = async(req,res)=>{
    try {

      const result = await Query.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
      }).populate("studentId fullName");
      if(!result){
        return res.status(404).json({msg:"Query with given id not found!"})
      }
      res.status(200).json({msg:"Update successful!",data:result});
    } catch (error) {
      console.log(error.message);
      return res.status(404).json({msg:"Couldn't update!"})
    }
  }
  //@route Delete /notice/delete/:id
  exports.deleteQuery = async(req,res)=>{
    try {
      const result = await Query.findByIdAndDelete(req.params.id);
      const result1 = await Notification.findOneAndDelete({contentId:req.params.id});
      if(!result){
        return res.status(404).json({msg:"Query with given id not found!"})
      }
      res.status(200).json({msg:"Delete successful!"});
    } catch (error) {
      console.log(error.message);
      return res.status(404).json({msg:"Couldn't delete!"})
    }
  }
  