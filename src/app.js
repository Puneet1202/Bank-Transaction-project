import express from "express";
const app = express();
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import accountRoutes from "./routes/account.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Bank Transaction API ✅",
        status: "running",
        timestamp: new Date()
    })
})
 

 
app.use("/api/auth",authRoutes);
app.use("/api/account",accountRoutes);
app.use("/api/transaction",transactionRoutes);



export default app;