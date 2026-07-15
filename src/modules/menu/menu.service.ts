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

// Update Menu
export async function updateMenu(id: string, menuData: Partial<IMenu>) {
  try {
    const existingMenu = await Menu.findById(id);

    if (!existingMenu) {
      throw new Error("Menu not found");
    }

    const updateData: Partial<IMenu> = {};

    if (menuData.name !== undefined) updateData.name = menuData.name;

    if (menuData.description !== undefined)
      updateData.description = menuData.description;

    if (menuData.price !== undefined) updateData.price = menuData.price;

    if (menuData.image !== undefined) updateData.image = menuData.image;

    if (menuData.restaurantId !== undefined)
      updateData.restaurantId = menuData.restaurantId;

    if (menuData.isAvailable !== undefined)
      updateData.isAvailable = menuData.isAvailable;

    if (menuData.preparationTime !== undefined)
      updateData.preparationTime = menuData.preparationTime;

    if (menuData.discount !== undefined)
      updateData.discount = menuData.discount;

    const updatedMenu = await Menu.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    );

    console.log("Menu Updated Successfully");

    return updatedMenu;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update menu");
  }
}

// get resturent menus
export async function getRestaurantMenus(restaurantId: string) {
  try {
    return await Menu.find({ restaurantId });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch restaurant menu");
  }
}

// Delete Menu
export async function deleteMenu(id: string) {
  try {
    const existingMenu = await Menu.findById(id);

    if (!existingMenu) {
      throw new Error("Menu not found");
    }

    await Menu.findByIdAndDelete(id);

    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete menu");
  }
}
