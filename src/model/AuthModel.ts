import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
    name?: string;
    email: string;
    password: string;
}

// Define the schema for the User model
const UserSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter a name"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please enter an email"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
        },
        password: {
            type: String,
            required: [true, "Please enter a password"],
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Create the User model
const User = mongoose.model<IUser>("User", UserSchema);

export default User;
export { IUser };