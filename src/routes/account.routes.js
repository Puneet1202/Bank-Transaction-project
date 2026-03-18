import express from "express";
const router = express.Router();
import {createAccountController} from "../controllers/account.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";




router.post("/create",authMiddleware,createAccountController);


export default router;  