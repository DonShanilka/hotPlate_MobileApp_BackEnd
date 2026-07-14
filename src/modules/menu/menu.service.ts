import Menu from "./menu.model";
import { IMenu } from "./menu.interface";

// Create Menu
export async function createMenu(menuData: IMenu) {
  try {
    const menu = await Menu.create(menuData);

    console.log("Menu Created Successfully");

    return menu;
  } catch (error) {
    console.error("Error Creating Menu:", error);
    throw new Error("Failed to create menu");
  }
}

// Get All Menus
export async function getMenus() {
  try {
    return await Menu.find()
      .populate("restaurantId", "name address phone")
      .sort({ createdAt: -1 });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch menus");
  }
}

// Get Menu By ID
export async function getMenuById(id: string) {
  try {
    const menu = await Menu.findById(id).populate(
      "restaurantId",
      "name address phone",
    );

    if (!menu) {
      throw new Error("Menu not found");
    }

    return menu;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch menu");
  }
}
