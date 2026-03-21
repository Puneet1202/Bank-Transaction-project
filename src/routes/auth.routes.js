import express from 'express';
const router = express.Router();
import {registerController,loginController,logoutController}     from "../controllers/auth.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";

 router.post ('/register', registerController)
router.post('/login', loginController)

/*
 * @description logout from the server
 * @route POST /api/auth/logout
 * @access Private
 */
router.post('/logout',authMiddleware,logoutController)



export default router;