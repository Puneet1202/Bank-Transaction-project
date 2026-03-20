import userModel from "../model/user.model.js";
import accountModel from "../model/account.model.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();

const createSystemAccount = async () => {
    await mongoose.connect(process.env.MONGODB_URI);

    // Pehle check karo exist karta hai ya nahi
    const isExist = await userModel.findOne({ username: "system" });
    if (isExist) {
        console.log("System account already exists!");
        process.exit(0);
    }

    // System user banao
    const systemUser = await userModel.create({
        email: "system@gmail.com",
        username: "system",
        password: "System123@",
        role: "user",
        systemUser: true  // ← automatically true
    });

    // System account banao
    const accountNumber = crypto.randomInt(100000000000, 999999999999).toString();
    const systemAccount = await accountModel.create({
        user: systemUser._id,
        accountNumber: accountNumber,
        status: "Active",
        currency: "INR"
    });

    console.log("✅ System User ID:", systemUser._id);
    console.log("✅ System Account ID:", systemAccount._id);
    console.log("✅ Done! Ab Postman se test karo");
    
    process.exit(0);
}

createSystemAccount();