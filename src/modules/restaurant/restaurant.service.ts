import Restaurant from "./restaurant.model";

// create
export const createRestaurant = async (data: any) => {
  const restaurant = await Restaurant.create(data);
  console.log("Create Successfully Room: ", restaurant);
  return restaurant;
};

// get all
export const getRestaurants = async () => {
  return await Restaurant.find().populate("owner", "name email");
};

// get by id
export const getRestaurantById = async (id: string) => {
  const restaurant = await Restaurant.findById(id).populate(
    "owner",
    "name email",
  );

  if (!restaurant) throw new Error("Restaurant not found");

  return restaurant;
};

// update
export const updateRestaurant = async (id: string, data: any) => {
  return await Restaurant.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

// delete
export const deleteRestaurant = async (id: string) => {
  return await Restaurant.findByIdAndDelete(id);
};
