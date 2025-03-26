import mongoose from "mongoose";
import Auth, {IUser} from "../model/AuthModel";
// @ts-ignore
import bcrypt from 'bcrypt';

export async function AddUser(authData : IUser) {
    const hashPassword = await bcrypt.hash(authData.password, 10);
    try {
        const added = new Auth({
            name: authData.name,
            email: authData.email,
            password: authData.password
        })
        const savedUser = await added.save();
        console.log("User Saved :",savedUser);
    } catch (error) {
        console.log("Error Save Auth in AuthService:  ", error);
    }
}

export async function VerifyUser(user: Partial<IUser>) {
    try {
        const existingUser: IUser | null = await Auth.findOne({ email: user.email });

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

        const updateUser = await Auth.findByIdAndUpdate(
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
    return await Auth.findByIdAndDelete(id);
}

