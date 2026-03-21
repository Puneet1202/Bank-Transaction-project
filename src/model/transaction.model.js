import mongoose from "mongoose";
import crypto from "crypto";

const transactionSchema = new mongoose.Schema({

    fromAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required:[true,"From account is required for creating a transaction"],
        index:true,
        immutable:true
    },
    toAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"AccToount",
        required:[true," account is required for creating a transaction"],
        index:true,
        immutable:true
    },
    amount:{
        type:Number,
        required:[true,"Amount is required for creating a transaction"],
        immutable:true
    },
    type:{
        type:String,
        enum:["deposit","withdrawal","transfer"],
        required:[true,"Type is required for creating a transaction"]   ,
        immutable:true
    },
    status:{
        type:String,
        enum:["pending","completed","failed"],
        default:"pending",
    },
    referenceId:{
        type:String,
        unique:true,
        trim:true,
        immutable:true,
        default: () => crypto.randomInt(100000000000, 999999999999).toString(),
        match:[
            /^[0-9]{12}$/,
            "Reference ID must be 12 digits long"
        ]
    },
    description:{
        type:String,
        trim:true
    },
    balanceAfterTransaction:{
        type:Number,
    },
    idempotencyKey:{
        type:String,
        unique:true,
        sparse:true,
        trim:true,
        default: () => crypto.randomInt(100000000000, 999999999999).toString(),

        match:[
            /^[0-9]{12}$/,
            "Idempotency key must be 12 digits long"
        ]
    }

    
},{
    timestamps:true
})

function preventTransactionModification() {
    const update = this.getUpdate?.();
    const updateFields = Object.keys(update?.$set || update || {});
    const allowedFields = ["status"];
    const isAllowed = updateFields.every(field => allowedFields.includes(field));
    if (!isAllowed) {
        throw new Error("Transaction cannot be modified");
    }
}

// Delete bilkul nahi hoga
function preventTransactionDeletion() {
    throw new Error("Transaction cannot be deleted");
}

// Update hooks
transactionSchema.pre("findOneAndUpdate", preventTransactionModification);
transactionSchema.pre("updateOne", preventTransactionModification);
transactionSchema.pre("updateMany", preventTransactionModification);

// Delete hooks
transactionSchema.pre("findOneAndDelete", preventTransactionDeletion);
transactionSchema.pre("deleteOne", preventTransactionDeletion);
transactionSchema.pre("deleteMany", preventTransactionDeletion);

const transactionModel = mongoose.model("Transaction",transactionSchema);

export default transactionModel;