import jwt from "jsonwebtoken";
import User from '../models/user.js';

export const requireSignin = (req, res, next) => {
    // console.log("REQ HEADERS =>", req.headers);
    try{
        const decoded = jwt.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        );
        // console.log("decoded =>", decoded);
        req.user = decoded;
        next();
    }catch (err){
        return res.status(401).json(err);
    }
};

export const isAdmin = async(req,res,next) => {
    try{
        const user = await User.findById(req.user._id);
        if(user.role != 1){
            return res.status(401).send('Unauthorised');
        }else{
            next();
        }
    }catch(err){
        console.log(err);
    }
}