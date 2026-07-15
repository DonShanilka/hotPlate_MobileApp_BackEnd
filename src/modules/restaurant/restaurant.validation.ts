import Joi from "joi";

export const restaurantSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    "string.min": "Restaurant name must contain at least 3 characters",
    "any.required": "Restaurant name is required",
  }),

  description: Joi.string().required(),

  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Email must be a valid email address",
  }),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be exactly 10 digits",
      "any.required": "Phone number is required",
    }),

  address: Joi.string().required(),

  cuisine: Joi.array().items(Joi.string()).required().messages({
    "any.required": "Cuisine list is required",
  }),

  openingTime: Joi.string().required(),

  closingTime: Joi.string().required(),

  rating: Joi.number().min(0).max(5),
});

export const updateRestaurantSchema = Joi.object({
  name: Joi.string().min(3),
  description: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[0-9]{10}$/),
  address: Joi.string(),
  cuisine: Joi.array().items(Joi.string()),
  openingTime: Joi.string(),
  closingTime: Joi.string(),
  rating: Joi.number().min(0).max(5),
  isActive: Joi.boolean(),
});

