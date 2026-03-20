import mongoose from "mongoose";
import ledgerModel from "./ledger.model.js";

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required for creating an account"],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ["Active", "Frozen", "Inactive"],
            message: "Status is required for creating an account"
        },
        default: "Active"
    },
    currency: {
        type: String,
        enum: ["INR", "USD", "EUR"],
        default: "INR"
    },
    accountNumber: {
        type: String,
        required: [true, "Account number is required for creating an account"],
        unique: true,
        trim: true,
        match: [
            /^[0-9]{12}$/,
            "Account number must be 12 digits long"
        ]
    },
    accountType: {
        type: String,
        enum: ["Savings", "Current"],
        default: "Savings"
    }
}, {
    timestamps: true
})

accountSchema.index({ user: 1, status: 1 })

accountSchema.methods.getBalance = async function(){     //methods matlab — har account object pe yeh function available hoga.

    const balanceData = await ledgerModel.aggregate([
        //stage 1
        {
            $match:{
                account:this._id  //this matlab — jo account hai us waqt — uski ID
            }
        },
        //stage 2
        {
            $group:{
                _id:null,
                totalDebit:{
                    $sum:{
                        $cond:[{
                            $eq:[
                                "$type",
                                "debit"
                            ]
                        },"$amount",0]
                    }
                },
                totalCredit:{
                    $sum:{
                        $cond:[{
                            $eq:[
                                "$type",
                                "credit"
                            ]
                        },"$amount",0]
                    }
                },
                
               
            }
        },
        //stage 3
                {
                    $project:{
                        _id:0,
                        balance:{
                            $subtract:[
                                "$totalCredit",
                                "$totalDebit"
                            ]
                        }
                    }
                }
    ])
    if(!balanceData[0]?.balance){
        return 0;
    }
   return balanceData[0]?.balance;
}

const accountModel = mongoose.model("Account", accountSchema);

export default accountModel;