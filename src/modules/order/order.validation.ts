import Joi from "joi";

// Validate a single item inside the items array
const orderItemSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Item name is required",
    "any.required": "Item name is required",
  }),
  size: Joi.string().optional(),
  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "Item quantity must be a number",
    "number.min": "Item quantity must be at least 1",
    "any.required": "Item quantity is required",
  }),
  price: Joi.number().min(0).required().messages({
    "number.base": "Item price must be a number",
    "number.min": "Item price cannot be negative",
    "any.required": "Item price is required",
  }),
});

// Validate a new order submission (POST /AddOrder)
export const addOrderSchema = Joi.object({
  userId: Joi.string().optional(),
  restaurantId: Joi.string().optional(),

  address: Joi.string().required().messages({
    "string.empty": "Delivery address is required",
    "any.required": "Delivery address is required",
  }),

  phoneNumber: Joi.string()
    .pattern(/^[0-9+\-\s()]{7,15}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone number format is invalid",
      "any.required": "Phone number is required",
    }),

  totalPrice: Joi.number().min(0).required().messages({
    "number.base": "Total price must be a number",
    "number.min": "Total price cannot be negative",
    "any.required": "Total price is required",
  }),

  items: Joi.array().items(orderItemSchema).min(1).required().messages({
    "array.base": "Items must be an array",
    "array.min": "Order must have at least one item",
    "any.required": "Order items are required",
  }),

  paymentMethod: Joi.string().valid("CASH", "CARD", "ONLINE").default("CASH"),
  notes: Joi.string().optional().allow(""),
});

// Validate status update (PATCH /status/:id)
export const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      "PENDING",
      "CONFIRMED",
      "PREPARING",
      "READY_FOR_PICKUP",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED"
    )
    .required()
    .messages({
      "any.only": "Invalid order status",
      "any.required": "Status is required",
    }),
});

// Validate driver assignment (PATCH /assign-driver/:id)
export const assignDriverSchema = Joi.object({
  driverId: Joi.string().required().messages({
    "string.empty": "Driver ID is required",
    "any.required": "Driver ID is required",
  }),
  estimatedDeliveryTime: Joi.number().integer().min(1).optional().messages({
    "number.min": "Estimated delivery time must be at least 1 minute",
  }),
});

// Validate payment status update (PATCH /payment/:id)
export const updatePaymentSchema = Joi.object({
  paymentStatus: Joi.string().valid("UNPAID", "PAID", "REFUNDED").required().messages({
    "any.only": "Invalid payment status",
    "any.required": "Payment status is required",
  }),
  paymentMethod: Joi.string().valid("CASH", "CARD", "ONLINE").optional(),
});
