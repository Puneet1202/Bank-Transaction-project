import express from "express";
const router = express.Router();
import {createAccountController,getUserAccountController,getBalanceController } from "../controllers/account.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";


/**
 * @description create a new account
 * @route POST /api/account/create
 * @access Private
 */

router.post("/create",authMiddleware,createAccountController);

 /**
  * @description get all accounts logged in user
  * @route GET /api/account/get
  * @access Private
  */ 
router.get("/get",authMiddleware,getUserAccountController);



/**
 * @description get all accounts logged in user and show balance
 * @route GET /api/account/Balance/:accountId
 * @access Private
 */

router.get("/Balance/:accountId",authMiddleware,getBalanceController);



export default router;  