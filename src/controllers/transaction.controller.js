import transactionModel from "../model/transaction.model.js";
import accountModel from "../model/account.model.js";
import ledgerModel from "../model/ledger.model.js";
import { sendTransactionEmail } from '../services/email.service.js'
import mongoose from "mongoose";


/**
 * -create a new transaction
 * the 10 step transfer flow
 *    * validation request
 *    * account validation
 *    * idempotency check
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
    const { fromAccount, toAccount, amount, type, idempotencyKey } = req.body;

    if(!fromAccount || !toAccount || !amount || !type || !idempotencyKey){
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
    }
    //stage 2 account validation
    const fromUserAccount = await accountModel.findById(fromAccount);
    const toUserAccount = await accountModel.findById(toAccount);
    if(!fromUserAccount || !toUserAccount){
        return res.status(404).json({
            success:false,
            message:"Account not found"
        })
    }

    //stage 3 idempotency check
       if (idempotencyKey) {

    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    })

    if (isTransactionAlreadyExists) {
        return res.status(400).json({
            success: false,
            message: `Transaction already ${isTransactionAlreadyExists.status}`
        })
    }
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

    const balance = await fromUserAccount.getBalance();
    if(balance<amount){
        return res.status(400).json({
            success:false,
            message:"Insufficient balance"
        })
    }

      

//stage 6 create transaction

const session = await mongoose.startSession();
session.startTransaction();
    
const transaction = await transactionModel.create([{
    fromAccount:fromAccount,
    toAccount:toAccount,
    amount:amount,
    type:type,
    idempotencyKey:idempotencyKey,

}],{session})   
 //stage 7 create ledger
const debitLedger = await ledgerModel.create([
    {
    account:fromAccount,
    amount:amount,
    type:"debit",
    transaction:transaction._id,
    balance:fromUserAccount.balance
}],{session})

const creditLedger = await ledgerModel.create([
    {
    account:toAccount,
    amount:amount,
    type:"credit",
    transaction:transaction._id,
    balance:toUserAccount.balance
    
}],{session})

    


//stage 8 update account balance
transaction.status = "success";

await transaction.save({session});
//stage 9 end session
await session.commitTransaction();
session.endSession();


//email send

     await sendTransactionEmail(fromUserAccount.email,fromUserAccount.username,amount,type);
     await sendTransactionEmail(toUserAccount.email,toUserAccount.username,amount,type);
      

     return res.status(200).json({
        success:true,
        message:"Transaction created successfully",
        data:transaction
     })
}
