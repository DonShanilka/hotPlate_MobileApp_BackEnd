import mongoose from "mongoose";
import Item , { Iitem } from "../model/ItemModel";

export async function AddItem(item : Iitem) {
  try {
      const newItem = new Item({
          itemName: item.itemName,
          catogory: item.catogory,
          discription: item.discription,
          shopName: item.shopName,
          price: item.price
      })
      const saveItem = await newItem.save();
      console.log("Item Saved: " + saveItem);
  } catch (error) {
    console.log("Error Save Item", error);
  }
}