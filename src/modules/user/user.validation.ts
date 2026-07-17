import Joi from "joi";

export const registerSchema = Joi.object({
  first_name: Joi.string().min(2).required().messages({
    "any.required": "First name is required",
    "string.min": "First name must be at least 2 characters",
  }),

  last_name: Joi.string().allow("", null),

  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Email must be a valid email address",
  }),

  password: Joi.string().min(6).required().messages({
    "any.required": "Password is required",
    "string.min": "Password must be at least 6 characters long",
  }),

  phone: Joi.string().allow("", null),

  role: Joi.string()
    .valid("CUSTOMER", "DRIVER", "RESTAURANT", "ADMIN")
    .messages({
      "any.only": "Role must be CUSTOMER, DRIVER, RESTAURANT, or ADMIN",
    }),
  address: Joi.string().optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Email must be a valid email address",
  }),

  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});
