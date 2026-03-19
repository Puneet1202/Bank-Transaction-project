import mongoose  from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is required for creating a user"],
        unique :[true,"Email already exists"],
        lowercase:true,
        trim:true,
        match:[
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            "Please provide a valid email address (e.g. name@example.com)"]
    },
    username:{
        type:String,
        required:[true,"Username is required for creating a user"],
        unique :[true,"Username already exists"],
        lowercase:true,
        trim:true,
        match:[
            /^[a-zA-Z0-9_]{3,20}$/,
            "Username must be at least 3 characters long and can only contain letters, numbers, and underscores."]
    },
    password:{
        type:String,
        required:[true,"Password is required for creating a user"],
        match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character."],
        select:false,
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    }   ,
    systemUser:{
        type:Boolean,
        default:false,
        immutable:true,
        select:false
    }


},{
    timestamps:true 
})

userSchema.pre("save",async function(){
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password,10);
    
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
}

export default mongoose.model("User",userSchema);

