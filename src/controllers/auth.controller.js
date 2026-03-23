import userModel from "../model/user.model.js";
import blackListModel from "../model/blackList.model.js";
import jwt from "jsonwebtoken";
import {sendEmail,transporter,sendWelcomeEmail,sendLoginEmail  }from "../services/email.service.js";


/**
 * @description Authentication ke saare routes (Register, Login, Logout)
 * @base_url /api/auth
 * @see src/routes/auth.routes.js
 */
export const registerController = async(req,res)=>{
    const{email,username,password,role} = req.body;
    
    try{

    
    if(!email || !username || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    const isExist = await userModel.findOne({
        $or:[
            {email:email},
            {username:username}
        ]
    })
    if(isExist){
        if(isExist.email === email  ){
            return res.status(422).json({message:"User with this email already exists"});
        }
        
        return res.status(422).json({message:"User with this username already exists"});
    }

    const user = new userModel({
        email,
        username,
        password,
        role
    })
        await user.save();
        const token = jwt.sign({id:user._id , role:user.role},process.env.JWT_SECRET,{expiresIn:"1h"});
        const userResponse =  user.toObject();
        delete userResponse.password;   
        res.cookie("token",token,{httpOnly:true,
            secure:true,
            sameSite:"strict",
            secure: process.env.NODE_ENV === 'production',
            maxAge:3600000});
        sendWelcomeEmail(user,password);
      
      return res.status(201).json({message:"create success",user:userResponse});

   

}catch(error){
    console.log(error);
    if(error.name ==="ValidationError"){
        const errormsg = Object.values(error.errors).map((err)=>err.message);
        return res.status(400).json({message:errormsg[0]});
    }
    if(error.name ==="CastError"){

        return res.status(400).json({message:"Invalid ID"});
    }
    if(error.code === 11000){
        return res.status(400).json({message:"User with this email or username already exists"});
    }
    return res.status(500).json({message:"Internal server error"}); 

}
}

/**
 * @description Login controller
 * @base_url /api/auth
 * @see src/routes/auth.routes.js
 */


export const loginController = async(req,res)=>{
  
    try{
          const {email,password,username} = req.body;
          const user = await  userModel.findOne({
            $or:[
                {email:email},
                {username:username}
            ]
          }).select("+password")

          if(!user){
            return res.status(404).json({message:"Invalid credentials"});
          }
          const isPasswordCorrect = await user.isPasswordCorrect(password)
          if(!isPasswordCorrect){
            return res.status(401).json({message:"Invalid credentials"});

          }
          const token = jwt.sign({id:user._id , role:user.role},process.env.JWT_SECRET,{expiresIn:"1h"});
         res.cookie("token",token,{httpOnly:true,secure:true,sameSite:"strict",maxAge:3600000});
         await sendLoginEmail(user);
          return res.status(200).json({message:" login sucessfully", });

    }catch (error){
      return res.status(500).json({message:"Internal server error"}); 
    }
    
}


/**
 * @description Logout controller
 * @base_url /api/auth
 * @see src/routes/auth.routes.js
 */

export const logoutController = async(req,res)=>{
    try{
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(400).json({message:"Token not found"});
        }
       
        res.clearCookie("token");
        const blackList = await blackListModel.create({
            token:token
        })
        return res.status(200).json({message:"Logout sucessfully" , blackList});
    }catch(error){
        return res.status(500).json({message:"Internal server error"});
    }
}

