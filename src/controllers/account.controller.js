 import accountModel from "../model/account.model.js";
 import userModel from "../model/user.model.js";
 import jwt from "jsonwebtoken";
 import {sendEmail,transporter,sendWelcomeEmail  }from "../services/email.service.js";



/**
 * @description Account creation controller
 * @base_url /api/account
 * @see src/routes/account.routes.js
 */


export const createAccountController = async(req,res)=>{
   const user = req.user;
const accountNumber = Math.floor(100000000000 + Math.random() * 900000000000).toString();


   const account = await accountModel.create({
    user:user.id,
    accountNumber,
    
   })
   return res.status(200).json({message:"Account created successfully",account});

}

