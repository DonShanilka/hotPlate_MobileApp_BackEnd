import mongoose from "mongoose";
import User, {IUser} from "../model/AuthModel";
// @ts-ignore
import bcrypt from 'bcrypt';

export async function AddUser(user : IUser) {
    const hashPassword = await bcrypt.hash(user.password,10);
    try{
        const newUser = new User({
            name:user.name,
            email:user.email,
            password:hashPassword
        })
        const saveUser =await newUser.save();
        console.log("User Saved :",saveUser)
    }catch (err){
        console.log("Error During User :", err)
    }
}

export async function VerifyUser(user: Partial<IUser>) {
    try {
        const existingUser: IUser | null = await User.findOne({ email: user.email });

        if (!existingUser) {
            console.error("User not found");
            return false;
        }

        if (!user.password) {
            console.error("Password is missing in request");
            return false;
        }

        if (!existingUser.password) {
            console.error("Stored password is missing");
            return false;
        }

        const isMatch = await bcrypt.compare(user.password, existingUser.password);
        return isMatch;
    } catch (error) {
        console.error("Error during user verification:", error);
        return false;
    }
}

export async function UpdateUser (id : any, userData : any)  {
    try {
        console.log("Updating User in Service:", id, userData);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid User ID");
        }

        const updateUser = await User.findByIdAndUpdate(
            id,
            {$set: userData},
            {new: true, runValidators: true}
        );

        if (!updateUser) {
            throw new Error("Customer not Found");
        }

        return updateUser;
    } catch (error) {
        console.error("Error in UserService update: ", error);
        throw new Error("Failed to Update User");
    }
}

export async function deleteUser(id:any) {
    return await User.findByIdAndDelete(id);
}

