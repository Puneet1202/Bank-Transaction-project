
import app from "./src/app.js";

import connectDB from "./src/db/db.js";
const PORT = process.env.PORT || 8000;

const connectServer=async()=>{
    
    try{
       
        await connectDB();
        app.listen(`${PORT}`,()=>{
            console.log(`Server is running on port ${PORT}`);
        })
    } 
    catch(error){
        console.log("MONGODB connection error",error);
        process.exit(1);
    }
}

connectServer();
