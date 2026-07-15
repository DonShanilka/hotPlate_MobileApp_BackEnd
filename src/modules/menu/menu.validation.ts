import Joi from "joi";

export const menuSchema = Joi.object({
  restaurantId: Joi.string().required().messages({
    "any.required": "Restaurant ID is required",
  }),

  name: Joi.string().min(2).required().messages({
    "any.required": "Item name is required",
    "string.min": "Item name must be at least 2 characters",
  }),

  description: Joi.string().allow("", null),

  price: Joi.number().min(0).required().messages({
    "any.required": "Price is required",
    "number.min": "Price cannot be negative",
  }),

  rating: Joi.number().min(0).max(5).default(0),

  isAvailable: Joi.boolean().default(true),

  preparationTime: Joi.number().min(0).messages({
    "number.min": "Preparation time cannot be negative",
  }),

  discount: Joi.number().min(0).max(100).default(0).messages({
    "number.min": "Discount cannot be negative",
    "number.max": "Discount cannot exceed 100%",
  }),
});

export const updateMenuSchema = Joi.object({
  restaurantId: Joi.string(),
  name: Joi.string().min(2),
  description: Joi.string().allow("", null),
  price: Joi.number().min(0),
  rating: Joi.number().min(0).max(5),
  isAvailable: Joi.boolean(),
  preparationTime: Joi.number().min(0),
  discount: Joi.number().min(0).max(100),
});
