import mongoose from "mongoose";

const Auth = require('../model/AuthModel');
import bcrypt from 'bcrypt/bcrypt'

const AddUser = async (authData) => {
    const hashPassword = await bcrypt.hash(Auth.password, 10);
    try {
        const added = new Auth({
            name: authData.name,
            email: authData.email,
            password: authData.password
        })
        const saved = await Auth.create(added);
        return saved;
    } catch (error) {
        console.log("Error Save Auth in AuthService:  ", error);
    }
}

const UpdateUser = async (id, userData) =>  {
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

const deleteUser = async (id) => {
    return await Auth.findByIdAndDelete(id);
}


module.exports = {AddUser, UpdateUser, deleteUser};