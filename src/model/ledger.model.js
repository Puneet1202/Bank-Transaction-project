import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema({

   account:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Account",
    required:[true,"Account is required for creating a ledger"],
    index:true,
    immutable:true
   },
   amount:{
    type:Number,
    required:[true,"Amount is required for creating a ledger"],
    immutable: true
    
   },
   transaction:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Transaction",
    required:[true,"Transaction ID is required for creating a ledger"],
    index:true,
    immutable:true
   },
   balance: {
    type: Number,
    required: [true, "Balance is required"],
    immutable: true  // ← transaction ke waqt jo balance tha woh hamesha same rahega
},
   type:{
    type:String,
    enum:["credit","debit"],
    required:[true,"Type is required for creating a ledger"],
    immutable:true
   }
   
    
},{
    timestamps:true
})


 function preventledgerModification(){
    throw new Error("Ledger cannot be modified")
 }

ledgerSchema.pre("update",preventledgerModification);
ledgerSchema.pre("delete",preventledgerModification);
ledgerSchema.pre("findOneAndUpdate",preventledgerModification);
ledgerSchema.pre("updateOne",preventledgerModification);
ledgerSchema.pre("updateMany",preventledgerModification);
ledgerSchema.pre("deleteMany",preventledgerModification);
ledgerSchema.pre("deleteOne", preventledgerModification);       
ledgerSchema.pre("findOneAndDelete", preventledgerModification); 

const ledgerModel = mongoose.model("Ledger",ledgerSchema);

export default ledgerModel;