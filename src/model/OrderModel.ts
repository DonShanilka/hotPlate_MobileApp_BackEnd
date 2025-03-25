import mongoose, { Schema } from 'mongoose';

interface UserInterface extends Document{
    name: String;
    email: String;
    password: String;
}

const UserSchema: Schema<UserInterface> = new Schema({
        name: {
            type: String,
            required: [true, 'Please Enter the User Name'],
        },
        email: {
            type: String,
            required: [true, 'Please Enter the User Email'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Please Enter the User Password'],
        },
    },
    {
        timestamps: true,
    })

const User = mongoose.model<UserInterface>('User', UserSchema);
module.exports = User;

