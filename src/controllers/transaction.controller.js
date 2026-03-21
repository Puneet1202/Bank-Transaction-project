import transactionModel from "../model/transaction.model.js";
import accountModel from "../model/account.model.js";
import ledgerModel from "../model/ledger.model.js";
import { sendTransactionEmail,sendFailedTransactionEmail } from '../services/email.service.js'
import mongoose from "mongoose";
import crypto from "crypto";


/**
 * -create a new transaction
 * the 10 step transfer flow
 *    * validation request
 *    * account validation
 *    * account status validation
 *    * currency validation
 *    * balance validation
 *    * create transaction
 *    * create ledger
 *    * update account balance
 *    * commit transaction
 */


export const createTransaction = async(req,res)=>{
 //stage 1 validation
    const { fromAccount, toAccount, amount, type } = req.body;

    if(!fromAccount || !toAccount || !amount || !type){
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
    }
    //stage 2 account validation
    const fromUserAccount = await accountModel.findById(fromAccount).populate("user");
    const toUserAccount = await accountModel.findById(toAccount).populate("user");
    if(!fromUserAccount || !toUserAccount){
        return res.status(404).json({
            success:false,
            message:"Account not found"
        })
    }


    //stage 4 account status validation
    if(fromUserAccount.status!=="Active" || toUserAccount.status!=="Active"){
        return res.status(400).json({
            success:false,
            message:"From account or To account is not active"
        })
    }
    //stage 4.1 currency validation
    if(fromUserAccount.currency!==toUserAccount.currency){
        return res.status(400).json({
            success:false,
            message:"From and To account must be in same currency"
        })
    }

        //stage 5 balance validation    ye sb aggregation pipeline ki wjha se horh ahai  jo  aggreation pipline account.model.js m  hook m bnayahai 

      const fromBalance = await fromUserAccount.getBalance();
    const toBalance = await toUserAccount.getBalance();
    if(fromBalance<amount){
        return res.status(400).json({
            success:false,
            message:"Insufficient balance"
        })
    }

      

//stage 6 create transaction

const session = await mongoose.startSession();
session.startTransaction();
    
try{
const transaction = await transactionModel.create([{
    fromAccount:fromAccount,
    toAccount:toAccount,
    amount:amount,
    type:type,

}],{session})   
 //stage 7 create ledger
const debitLedger = await ledgerModel.create([
    {
    account:fromAccount,
    amount:amount,
    type:"debit",
    transaction:transaction[0]._id,
    balance: fromBalance - amount
}],{session})

const creditLedger = await ledgerModel.create([
    {
    account:toAccount,
    amount:amount,
    type:"credit",
    transaction:transaction[0]._id,
    balance:toBalance+amount
    
}],{session})

    


//stage 8 update account balance
transaction[0].status = "completed";

await transaction[0].save({session});
//stage 9 end session
await session.commitTransaction();



//email send

     await sendTransactionEmail(
        fromUserAccount.user.email,
        fromUserAccount.user.username,
        amount,
        type);
     await sendTransactionEmail(
        toUserAccount.user.email,
        toUserAccount.user.username,
        amount,
        type);

      

     return res.status(200).json({
        success:true,
        message:"Transaction created successfully",
        data:transaction
     })

     }catch(error){
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({
            success:false,
            message:"Transaction failed",
            error:error.message
        })

     }finally{
        session.endSession();
     }
    
}



export const createInitialFundTransaction = async(req,res)=>{
    const{toAccount,amount} = req.body;
    if(!toAccount || !amount){
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
    }
    const toUserAccount = await accountModel.findById(toAccount).populate("user");
    if(!toUserAccount){
        return res.status(404).json({
            success:false,
            message:"Account not found"
        })
    }

    const fromUserAccount= await accountModel.findOne({
        user:req.user._id
    }).select("+systemUser")
    if(!fromUserAccount){
        return res.status(404).json({
            success:false,
            message:"System account not found"
        })
    }
    
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const referenceId = crypto.randomInt(100000000000, 999999999999).toString();
        const fromBalance = await fromUserAccount.getBalance();
        const toBalance = await toUserAccount.getBalance();

        const transaction= await transactionModel.create([{
            fromAccount:fromUserAccount._id,
            toAccount:toAccount,
            amount:amount,
            type:"deposit",
            referenceId:referenceId,
        }],{session})

        const debitLedger = await ledgerModel.create([
            {
            account:fromUserAccount._id,
            amount:amount,
            type:"debit",
            transaction:transaction[0]._id,
            balance: fromBalance-amount
            }],{session})
           
            const creditLedger = await ledgerModel.create([
            {
            account:toUserAccount._id,
            amount:amount,
            type:"credit",
            transaction:transaction[0]._id,
            balance:toBalance+amount
            }],{session})

            //status update
            transaction[0].status="completed";
            await transaction[0].save({session});
            await session.commitTransaction();
          
            return res.status(200).json({
                success:true,
                message:"Transaction created successfully",
                data:transaction[0]
            })
    }catch(error){
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({
            success:false,
            message:"Transaction failed",
            error:error.message
        })
    }
    finally{
        session.endSession();
    }
}