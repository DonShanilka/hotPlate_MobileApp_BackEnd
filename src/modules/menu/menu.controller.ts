import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import * as menuService from "./menu.service";
import { IMenu } from "./menu.interface";

export const createMenu = async (req: Request, res: Response) => {
  try {
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


export const updateMenu = async (
  req: Request,
  res: Response
) => {
  try {
    const menu: Partial<IMenu> = {
      ...req.body,
    };

    if (req.files?.image) {
      menu.image = (req.files.image as UploadedFile).data;
    }

    const result = await menuService.updateMenu(
      req.params.id as any,
      menu
    );

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