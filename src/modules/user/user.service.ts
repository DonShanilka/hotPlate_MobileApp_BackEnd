import bcrypt from "bcrypt";
import User from "./User";
import { IUser } from "./User";

function sanitizeUser(user: any) {
  const userObj = user.toObject ? user.toObject() : user;
  if (userObj.password) {
    delete userObj.password;
  }
  return userObj;
}

// Create User
export async function registerUser(userData: Partial<IUser>) {
  try {
    const email = userData.email?.toLowerCase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    if (!userData.password) {
      throw new Error("Password is required");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await User.create({
      first_name: userData.first_name,
      last_name: userData.last_name,
      email,
      password: hashedPassword,
      phone: userData.phone,
      role: "CUSTOMER",
      address: userData.address,
      status: "ACTIVE",
    });

    console.log("User Created Successfully:", newUser);

    return sanitizeUser(newUser);
  } catch (error: any) {
    console.error("Error Creating User:", error);
    throw new Error(error.message || "Failed to create user");
  }
}

// Login User
export async function loginUser(email: string, password: string) {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    return sanitizeUser(user);
  } catch (error: any) {
    console.error("Error Logging In User:", error);
    throw new Error(error.message || "Failed to login");
  }
}

// Get All Users
export async function getUsers() {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return users.map((user) => sanitizeUser(user));
  } catch (error: any) {
    console.error("Error Getting Users:", error);
    throw new Error("Failed to get users");
  }
}

// Get User By ID
export async function getUserById(id: string) {
  try {
    const user = await User.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    return sanitizeUser(user);
  } catch (error: any) {
    console.error("Error Finding User:", error);
    throw new Error(error.message || "Failed to get user");
  }
}

// Update User
export async function updateUser(id: string, userData: Partial<IUser>) {
  try {
    const existingUser = await User.findById(id);

    if (!existingUser) {
      throw new Error("User not found");
    }

    const updateData: any = {};

    if (userData.first_name !== undefined) {
      updateData.first_name = userData.first_name;
    }

    if (userData.last_name !== undefined) {
      updateData.last_name = userData.last_name;
    }

    if (userData.email !== undefined) {
      updateData.email = userData.email.toLowerCase();
    }

    if (userData.phone !== undefined) {
      updateData.phone = userData.phone;
    }

    if (userData.address !== undefined) {
      updateData.address = userData.address;
    }

    if (userData.profile_image !== undefined) {
      updateData.profile_image = userData.profile_image;
    }

    if (userData.status !== undefined) {
      updateData.status = userData.status;
    }

    if (userData.password !== undefined && userData.password) {
      updateData.password = await bcrypt.hash(userData.password, 10);
    }

    // Force role to CUSTOMER always
    updateData.role = "CUSTOMER";

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    );

    console.log("User Updated Successfully");

    return sanitizeUser(updatedUser);
  } catch (error: any) {
    console.error("Error Updating User:", error);
    throw new Error(error.message || "Failed to update user");
  }
}

// Delete User
export async function deleteUser(id: string) {
  try {
    const existingUser = await User.findById(id);

    if (!existingUser) {
      throw new Error("User not found");
    }

    await User.findByIdAndDelete(id);

    console.log("User Deleted Successfully:", id);

    return {
      message: "User deleted successfully",
    };
  } catch (error: any) {
    console.error("Error Deleting User:", error);
    throw new Error(error.message || "Failed to delete user");
  }
}
