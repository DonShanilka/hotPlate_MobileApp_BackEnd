import { Request, Response } from "express";
import * as restaurantService from "./restaurant.service";

// create
export const createRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await restaurantService.createRestaurant(req.body);

    res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      data: restaurant,
    });
  } catch (error: any) {
    res.status(500).json({
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
    const restaurant = await restaurantService.updateRestaurant(
      req.params.id as any,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      data: restaurant,
    });
  } catch (error: any) {
    res.status(500).json({
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
