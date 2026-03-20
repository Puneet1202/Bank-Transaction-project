import express from "express";
const router = express.Router();
import {createAccountController,getUserAccountController } from "../controllers/account.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";




router.post("/create",authMiddleware,createAccountController);
router.get("/get",authMiddleware,getUserAccountController);


export default router;  