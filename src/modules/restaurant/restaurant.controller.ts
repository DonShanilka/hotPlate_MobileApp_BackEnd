import { Request, Response } from "express";
import * as restaurantService from "./restaurant.service";
import { IRestaurant } from "../restaurant/restaurant.interface";
import { extractImage } from "../../extractFiles/extractImages";
import { extractVideo } from "../../extractFiles/extractVideo";
import { restaurantSchema, updateRestaurantSchema } from "./restaurant.validation";

// create
export const createRestaurant = async (req: Request, res: Response) => {
  try {
    // Parse cuisine if sent as string (JSON or comma separated)
    if (req.body.cuisine && typeof req.body.cuisine === "string") {
      try {
        req.body.cuisine = JSON.parse(req.body.cuisine);
      } catch {
        req.body.cuisine = req.body.cuisine.split(",").map((s: string) => s.trim());
      }
    }

    const { error } = restaurantSchema.validate(req.body, { allowUnknown: true });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const restaurant: IRestaurant = {
      ...req.body,
      image: extractImage(req),
      video: extractVideo(req),
    };

    console.log("Request Body:", req.body);
    console.log("Restaurant:", restaurant);

    const newRestaurant = await restaurantService.createRestaurant(restaurant);

    return res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      data: newRestaurant,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all
export const getRestaurants = async (req: Request, res: Response) => {
  try {
    const restaurants = await restaurantService.getAllRestaurants();

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get single
export const getRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await restaurantService.getRestaurantById(
      req.params.id as any,
    );

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// update
export const updateRestaurant = async (req: Request, res: Response) => {
  try {
    // Parse cuisine if sent as string (JSON or comma separated)
    if (req.body.cuisine && typeof req.body.cuisine === "string") {
      try {
        req.body.cuisine = JSON.parse(req.body.cuisine);
      } catch {
        req.body.cuisine = req.body.cuisine.split(",").map((s: string) => s.trim());
      }
    }

    const { error } = updateRestaurantSchema.validate(req.body, { allowUnknown: true });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const restaurant: Partial<IRestaurant> = {
      ...req.body,
    };

    // Update image only if a new image is uploaded
    if (req.files?.image) {
      restaurant.image = extractImage(req);
    }

    // Update video only if a new video is uploaded
    if (req.files?.video) {
      restaurant.video = extractVideo(req);
    }

    const updatedRestaurant = await restaurantService.updateRestaurant(
      req.params.id as any,
      restaurant,
    );

    return res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      data: updatedRestaurant,
    });
  } catch (error: any) {
    console.error("Update Restaurant Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// delete
export const deleteRestaurant = async (req: Request, res: Response) => {
  try {
    const result = await restaurantService.deleteRestaurant(
      req.params.id as any,
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
