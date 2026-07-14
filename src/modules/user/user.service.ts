import User from "./User";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwt";


// create user
export const registerUser = async (data: any) => {
  const existingUser = await User.findOne({
    email: data.email,
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashPassword = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    password: hashPassword,
    phone: data.phone,
    role: data.role
  });

  const token = generateToken(user._id.toString());

  return { user, token };
};


// login
export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user._id.toString());

  return { user, token };
};


// get all users
export const getUsers = async () => {
  return await User.find().select("-password");
};


// get by id
export const getUserById = async (id: string) => {
  return await User.findById(id).select("-password");
};


// update user
export const updateUser = async (id: string, data: any) => {
  return await User.findByIdAndUpdate(
    id, data,{new: true,},
  ).select("-password");
};


// delete user
export const deleteUser = async (id: string) => {
  return await User.findByIdAndDelete(id);
};
