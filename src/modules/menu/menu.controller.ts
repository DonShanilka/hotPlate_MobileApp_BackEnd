import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import * as menuService from "./menu.service";
import { IMenu } from "./menu.interface";
import { menuSchema, updateMenuSchema } from "./menu.validation";

export const createMenu = async (req: Request, res: Response) => {
  try {
    // Typecast numeric inputs sent as string in multipart form-data
    if (req.body.price !== undefined) req.body.price = Number(req.body.price);
    if (req.body.rating !== undefined) req.body.rating = Number(req.body.rating);
    if (req.body.preparationTime !== undefined) req.body.preparationTime = Number(req.body.preparationTime);
    if (req.body.discount !== undefined) req.body.discount = Number(req.body.discount);

    const { error } = menuSchema.validate(req.body, { allowUnknown: true });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const menu: IMenu = {
      ...req.body,
    };

    if (req.files?.image) {
      menu.image = (req.files.image as UploadedFile).data;
    }

    const result = await menuService.createMenu(menu);

    res.status(201).json({
      success: true,
      message: "Menu created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMenus = async (req: Request, res: Response) => {
  try {
    const menus = await menuService.getMenus();

    res.json({
      success: true,
      data: menus,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMenu = async (req: Request, res: Response) => {
  try {
    const menu = await menuService.getMenuById(req.params.id as any);

    res.json({
      success: true,
      data: menu,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateMenu = async (req: Request, res: Response) => {
  try {
    // Typecast numeric inputs sent as string in multipart form-data
    if (req.body.price !== undefined) req.body.price = Number(req.body.price);
    if (req.body.rating !== undefined) req.body.rating = Number(req.body.rating);
    if (req.body.preparationTime !== undefined) req.body.preparationTime = Number(req.body.preparationTime);
    if (req.body.discount !== undefined) req.body.discount = Number(req.body.discount);

    const { error } = updateMenuSchema.validate(req.body, { allowUnknown: true });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const menu: Partial<IMenu> = {
      ...req.body,
    };

    if (req.files?.image) {
      menu.image = (req.files.image as UploadedFile).data;
    }

    const result = await menuService.updateMenu(req.params.id as any, menu);

    res.json({
      success: true,
      message: "Menu updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRestaurantMenus = async (req: Request, res: Response) => {
  try {
    const menus = await menuService.getRestaurantMenus(
      req.params.restaurantId as any,
    );

    res.json({
      success: true,
      data: menus,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteMenu = async (req: Request, res: Response) => {
  try {
    await menuService.deleteMenu(req.params.id as any);

    res.json({
      success: true,
      message: "Menu deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
