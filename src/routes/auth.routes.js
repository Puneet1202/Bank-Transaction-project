import express from 'express';
const router = express.Router();
import {registerController,loginController}     from "../controllers/auth.controller.js";



 router.post ('/register',registerController)

router.post('/login',loginController)



export default router;