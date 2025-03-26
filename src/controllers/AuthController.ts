import {AddUser, VerifyUser, UpdateUser, deleteUser} from "../service/AuthService";
import {IUser} from "../model/AuthModel";


export async function  addAuth (req : any, res : any){
    const authData = req.body;
    console.log("authData in AuthController: ", authData);
    try {
        const auth = await AddUser(authData);
        console.log("auth ", auth);
        res.status(200).json(auth);
    } catch (error) {
        res.status(400).json({
            error: (error as Error).message
        });
    }
}

export async function verifyUser(req : any, res :any) {
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
}

export async function updateAuth (req : any, res : any){
    try {
        const {id} = req.params;
        const authData = req.body;

        const updateAuth = await UpdateUser(id, authData);

        if (!updateAuth) {
            return res.status(400).json({error: "Auth Not Found"});
        }

        res.status(200).json(updateAuth);
    } catch (error) {
        res.status(500).json({error: "Failed to Update Auth"})
    }
}
