import { Document } from "mongoose";


export interface IRestaurant extends Document {

    name: string;
    description: string;
    address: string;
    phone: string;
    image?: string;
    category: string;
    owner: string;
    rating?: number;
    isActive?: boolean;
}