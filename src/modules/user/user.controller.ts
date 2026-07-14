import { Request, Response } from "express";

import {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "./user.service";


// create user
export const register = async (req: Request, res: Response) => {
  try {
    const result = await registerUser(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// login
export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginUser(
      req.body.email,
      req.body.password,
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};


// get all users
export const getAllUsers = async (req: Request, res: Response) => {
  const users = await getUsers();
  res.json(users);
};


// get singke user
export const getSingleUser = async (req: Request, res: Response) => {
  const user = await getUserById(req.params.id as any);
  res.json(user);
};


// update
export const update = async (req: Request, res: Response) => {
  const user = await updateUser(
    req.params.id as any,
    req.body,
  );
  res.json(user);
};


// delete
export const remove = async (req: Request, res: Response) => {
  await deleteUser(req.params.id as any);
  res.json({
    message: "User deleted",
  });
};
