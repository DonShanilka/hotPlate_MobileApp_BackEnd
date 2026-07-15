import Joi from "joi";

export const driverSchema = Joi.object({
  userId: Joi.string().required().messages({
    "any.required": "User ID is required",
  }),

  vehicleType: Joi.string().valid("BIKE", "CAR").required().messages({
    "any.only": "Vehicle type must be either BIKE or CAR",
    "any.required": "Vehicle type is required",
  }),

  vehicleNumber: Joi.string().required().messages({
    "any.required": "Vehicle number is required",
  }),

  licenseNumber: Joi.string().required().messages({
    "any.required": "License number is required",
  }),

  phone: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .required()
    .messages({
      "string.pattern.base": "Phone number must contain only numbers",
      "string.min": "Phone number must be at least 10 digits long",
      "any.required": "Phone number is required",
    }),

  address: Joi.string().required().messages({
    "any.required": "Address is required",
  }),

  isAvailable: Joi.boolean(),
  isActive: Joi.boolean(),
  rating: Joi.number().min(0).max(5),
});

export const updateDriverSchema = Joi.object({
  vehicleType: Joi.string().valid("BIKE", "CAR"),
  vehicleNumber: Joi.string(),
  licenseNumber: Joi.string(),
  phone: Joi.string().pattern(/^[0-9]+$/).min(10),
  address: Joi.string(),
  isAvailable: Joi.boolean(),
  isActive: Joi.boolean(),
  rating: Joi.number().min(0).max(5),
});
