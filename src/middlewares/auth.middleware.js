
import jwt from "jsonwebtoken";


export const authMiddleware = async(req,res,next)=>{
     
    try{
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({
                message:"Unauthorized"
            })
        }
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        if(!decodedToken){
            return res.status(401).json({
                message:"Unauthorized"
            })
        }
        req.user = decodedToken;
        next();
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal server error"}); 
    }
}