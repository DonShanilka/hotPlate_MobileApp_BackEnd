import {AddUser, VerifyUser, UpdateUser, deleteUser} from "../service/AuthService";
import {IUser} from "../model/AuthModel";
import express from "express";
const router = express.Router();


router.post('/addUser', async (req, res) => {
    const user = req.body;

    try {
        const userAdded = await AddUser(user);
        res.status(201).json({ success: true, user: userAdded });
    } catch (err) {
        console.error("Error During User Adding:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

router.post('/login', async (req,res) => {
    console.log("Login Info :",req.body);
    const email = req.body.email;
    const password = req.body.password;

    const user:Partial<IUser> = {email,password};
    try{
        const isVerified = await VerifyUser(user);
        if (isVerified){
            res.status(201).json({success:true,user:isVerified});
        }else {
            res.status(404).json({success:false,message:"User Credential Invalid"});
        }
    }catch (err){
        console.log("Error Verify User");
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
});

module.exports = router;