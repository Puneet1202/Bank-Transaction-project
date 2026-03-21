
import jwt from "jsonwebtoken";
import userModel from "../model/user.model.js";
import blackListModel from "../model/blackList.model.js";


export const authMiddleware = async(req,res,next)=>{
     
    try{
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({
                message:"Unauthorized"
            })
        }
        const isBlacklisted = await blackListModel.findOne({token});
        if(isBlacklisted){
            return res.status(401).json({
                message:"Unauthorized"
            })
        }
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        if(!decodedToken){
            return res.status(401).json({
                message:"Unauthorized"
            })
        }
        req.user = decodedToken;
        next();
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal server error"}); 
    }
}

export const authSystemMiddleware = async(req,res,next)=>{
    try{
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({
                message:"Unauthorized"
            })
        }
        const isBlacklisted = await blackListModel.findOne({token});
        if(isBlacklisted){
            return res.status(401).json({
                message:"Unauthorized"
            })
        }
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
       const user = await userModel.findById(decodedToken.id).select("+systemUser")
       if(!user.systemUser){
        return res.status(403).json({
            message:"Forbidden access,not a system user"
        })
       }
       req.user = user;
      return  next();
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal server error"}); 
    }
}