import mongoose  from "mongoose";

const connectDB = async()=>{
    mongoose.connection.on('error', (err) => {
        console.log("❌ MongoDB running error:", err); 
    });

    mongoose.connection.on('disconnected', () => {
        console.log("⚠️ MongoDB disconnected! Connection lost...");
    });
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        const dbStats = await mongoose.connection.db.stats();
         const mongoUri = new URL(process.env.MONGODB_URI);
        const dbDetails = {
            Host: connectionInstance.connection.host,
            Database: connectionInstance.connection.name,
            Port: connectionInstance.connection.port,
            User: mongoUri.username, 
            Models_Loaded: Object.keys(connectionInstance.models).length, 
            State: connectionInstance.connection.readyState === 1 ? "Connected (1)" : "Other",
            Data_Size: `${(dbStats.dataSize / 1024).toFixed(2)} KB`, 
            Storage_Used: `${(dbStats.storageSize / 1024).toFixed(2)} KB`
             
        }; 
        console.clear();
        console.log("\n--- MongoDB Connection Details ---");
        console.table(dbDetails);
    }
    catch(error){ 
        console.log("MONGODB connection error",error);
        throw error; 
    }
} 

export default connectDB;