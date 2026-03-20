 import accountModel from "../model/account.model.js";
 import userModel from "../model/user.model.js";
 import transactionModel from "../model/transaction.model.js";
 import jwt from "jsonwebtoken";
 import {sendEmail,transporter,sendWelcomeEmail,sendCreateAccountEmail  }from "../services/email.service.js";



/**
 * @description Account creation controller
 * @base_url /api/account
 * @see src/routes/account.routes.js
 */


export const createAccountController = async(req,res)=>{
       
   try{
    const user = req.user;
       const isAccountExist = await accountModel.findOne({
            user: user.id
        })

        if(isAccountExist) {
            return res.status(400).json({
                message: "Account already exists"
            })
        }
   
   
   const userDoc = await userModel.findById(user.id);
        
   const accountNumber = Math.floor(100000000000 + Math.random() * 900000000000).toString();


   const account = await accountModel.create({
    user:user.id,
    accountNumber,
    
   })
   const populatedAccount = await accountModel
    .findById(account._id)
    .populate({
        path: "user",
        select: "username email"
    })

   return res.status(200).json({message:"Account created successfully",populatedAccount});
}catch(error){
    console.log(error);
    return res.status(500).json({message:"Internal server error"});
}

}



export const getUserAccountController=async(req,res)=>{
   const user = req.user;
   const account = await accountModel.findOne({
    user:user.id
   })
   if(!account){
    return res.status(404).json({message:"Account not found"});
   }
   return res.status(200).json({message:"Account found successfully",account});
}
