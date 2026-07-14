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
