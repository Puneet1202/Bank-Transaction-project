import express from "express";
const router = express.Router();
import { authMiddleware , authSystemMiddleware} from "../middlewares/auth.middleware.js";
import { createTransaction,createInitialFundTransaction } from "../controllers/transaction.controller.js";


router.post('/transaction',authMiddleware,createTransaction)


router.post("/system/initial-fund",authSystemMiddleware,createInitialFundTransaction)


export default router;