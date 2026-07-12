import Restaurant from "./restaurant.model";
import { IRestaurant } from "./restaurant.interface";

// Create Restaurant
export async function createRestaurant(data: IRestaurant) {
  try {
    const restaurant = await Restaurant.create(data);

    console.log("Restaurant Created Successfully:", restaurant._id);

    return restaurant;
  } catch (error) {
    console.error("Error Creating Restaurant:", error);
    throw new Error("Failed to create restaurant");
  }
}

// Get All Restaurants
export async function getAllRestaurants() {
  try {
    const restaurants = await Restaurant.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    return restaurants;
  } catch (error) {
    console.error("Error Getting Restaurants:", error);
    throw new Error("Failed to get restaurants");
  }
}

// Get Restaurant By ID
export async function getRestaurantById(id: string) {
  try {
    const restaurant = await Restaurant.findById(id).populate(
      "owner",
      "name email",
    );

    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    return restaurant;
  } catch (error) {
    console.error("Error Finding Restaurant:", error);
    throw new Error("Failed to get restaurant");
  }
}

// Update Restaurant
export async function updateRestaurant(id: string, data: Partial<IRestaurant>) {
  try {
    const existingRestaurant = await Restaurant.findById(id);

    if (!existingRestaurant) {
      throw new Error("Restaurant not found");
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    console.log("Restaurant Updated Successfully:", updatedRestaurant?._id);

    return updatedRestaurant;
  } catch (error) {
    console.error("Error Updating Restaurant:", error);
    throw new Error("Failed to update restaurant");
  }
}

// Delete Restaurant
export async function deleteRestaurant(id: string) {
  try {
    const existingRestaurant = await Restaurant.findById(id);

    if (!existingRestaurant) {
      throw new Error("Restaurant not found");
    }

    await Restaurant.findByIdAndDelete(id);
    console.log("Restaurant Deleted Successfully:", id);

    return {
      message: "Restaurant deleted successfully",
    };
  } catch (error) {
    console.error("Error Deleting Restaurant:", error);
    throw new Error("Failed to delete restaurant");
  }
}
