import Joi from "joi";

export const restaurantSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    "string.min": "Restaurant name must contain at least 3 characters",

    "any.required": "Restaurant name is required",
  }),

  description: Joi.string().required(),

  email: Joi.string().email().required(),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),

  address: Joi.string().required(),

  cuisine: Joi.array().items(Joi.string()).required(),

  openingTime: Joi.string().required(),

  closingTime: Joi.string().required(),

  rating: Joi.number().min(0).max(5),
});
