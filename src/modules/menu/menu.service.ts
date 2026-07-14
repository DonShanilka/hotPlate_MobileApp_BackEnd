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

