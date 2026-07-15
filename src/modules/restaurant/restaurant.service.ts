import Restaurant from "./restaurant.model";
import { IRestaurant } from "./restaurant.interface";

// Create Restaurant
export async function createRestaurant(restaurantData: IRestaurant) {
  try {
    const restaurant = await Restaurant.create({
      name: restaurantData.name,
      description: restaurantData.description,
      address: restaurantData.address,
      phone: restaurantData.phone,
      email: restaurantData.email,
      cuisine: restaurantData.cuisine,
      openingTime: restaurantData.openingTime,
      closingTime: restaurantData.closingTime,
      category: restaurantData.category,
      owner: restaurantData.owner,
      image: restaurantData.image,
      video: restaurantData.video,
      rating: 0,
      isActive: true,
    });

    console.log("Restaurant Created Successfully:", restaurant);

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
export async function updateRestaurant(
  id: string,
  restaurantData: Partial<IRestaurant>,
) {
  try {
    const existingRestaurant = await Restaurant.findById(id);

    if (!existingRestaurant) {
      throw new Error("Restaurant not found");
    }

    const updateData: any = {};

    // Only include fields that were sent
    if (restaurantData.name !== undefined)
      updateData.name = restaurantData.name;

    if (restaurantData.description !== undefined)
      updateData.description = restaurantData.description;

    if (restaurantData.address !== undefined)
      updateData.address = restaurantData.address;

    if (restaurantData.phone !== undefined)
      updateData.phone = restaurantData.phone;

    if (restaurantData.email !== undefined)
      updateData.email = restaurantData.email;

    if (restaurantData.cuisine !== undefined)
      updateData.cuisine = restaurantData.cuisine;

    if (restaurantData.openingTime !== undefined)
      updateData.openingTime = restaurantData.openingTime;

    if (restaurantData.closingTime !== undefined)
      updateData.closingTime = restaurantData.closingTime;

    if (restaurantData.category !== undefined)
      updateData.category = restaurantData.category;

    if (restaurantData.owner !== undefined)
      updateData.owner = restaurantData.owner;

    if (restaurantData.image !== undefined)
      updateData.image = restaurantData.image;

    if (restaurantData.video !== undefined)
      updateData.video = restaurantData.video;

    if (restaurantData.rating !== undefined)
      updateData.rating = restaurantData.rating;

    if (restaurantData.isActive !== undefined)
      updateData.isActive = restaurantData.isActive;

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    );

    console.log("Restaurant Updated Successfully");

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
