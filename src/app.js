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

// ===== DEBUG ROUTES — Remove these after debugging =====
import { sendEmail } from "./services/email.service.js";

// Test if outbound HTTPS requests work on Render
app.get("/debug/outbound-test", async (req, res) => {
    try {
        console.log('🔍 [DEBUG] Testing outbound HTTPS request...');
        const response = await fetch('https://api.brevo.com/v3/account', {
            headers: { 'api-key': process.env.BREVO_API_KEY || 'not-set' }
        });
        const data = await response.json();
        console.log('🔍 [DEBUG] Brevo account response:', response.status, JSON.stringify(data));
        res.json({ 
            status: response.status, 
            brevo_reachable: response.ok,
            data 
        });
    } catch (error) {
        console.error('🔍 [DEBUG] Outbound request FAILED:', error.message);
        res.status(500).json({ 
            error: error.message, 
            type: error.name,
            render_blocking: error.name === 'AbortError' || error.message.includes('ECONNREFUSED')
        });
    }
});

// Check if env vars are set
app.get("/debug/env-check", (req, res) => {
    res.json({
        BREVO_API_KEY: process.env.BREVO_API_KEY ? '✅ SET' : '❌ NOT SET',
        MONGODB_URI: process.env.MONGODB_URI ? '✅ SET' : '❌ NOT SET',
        JWT_SECRET: process.env.JWT_SECRET ? '✅ SET' : '❌ NOT SET',
        NODE_ENV: process.env.NODE_ENV || '❌ NOT SET',
        PORT: process.env.PORT || 'default 8000'
    });
});

// Test sending an actual email 
app.get("/debug/test-email", async (req, res) => {
    try {
        console.log('🔍 [DEBUG] Sending test email...');
        await sendEmail(
            "puneet.workdesk@gmail.com", 
            "Render Test Email", 
            "Test", 
            "<h1>Render Test</h1><p>If you see this, Brevo API works on Render!</p>"
        );
        res.json({ success: true, message: "Test email sent! Check inbox." });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// ===== END DEBUG ROUTES =====
 

 
app.use("/api/auth",authRoutes);
app.use("/api/account",accountRoutes);
app.use("/api/transaction",transactionRoutes);



export default app;