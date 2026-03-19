import express from "express";
const router = express.Router();
import { authMiddleware , authSystemMiddleware} from "../middlewares/auth.middleware.js";
import { createTransaction } from "../controllers/transaction.controller.js";


router.post('/transaction',authMiddleware,createTransaction)

/**
 * Post/api/transaction
 * create initial transaction
 * 
 */

router.post("/system/initial-fund",authSystemMiddleware)


export default router;