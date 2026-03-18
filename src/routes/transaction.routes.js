import express from "express";
const router = express.Router();
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createTransaction } from "../controllers/transaction.controller.js";


router.post('/transaction',authMiddleware,createTransaction)


export default router;