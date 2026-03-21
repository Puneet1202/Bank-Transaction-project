 import mongoose from "mongoose";

 const blackListSchema = new mongoose.Schema({

    token:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    BlacklistedAt:{
        type:Date,
        default:Date.now,
        immutable:true
    }
    
 },{
    timestamps:true
 })


blackListSchema.index({BlacklistedAt:1},
    {expireAfterSeconds: 3600 * 24});   //TTL time to live on hour
 const blackListModel = mongoose.model("BlackList",blackListSchema);

 export default blackListModel;