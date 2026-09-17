import Joi from "joi";
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "./order.interface";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const objectIdSchema = Joi.string().pattern(objectIdPattern);

const orderItemSchema = Joi.object({
  foodId: objectIdSchema.optional(),
  name: Joi.string().trim().required(),
  size: Joi.string().trim().optional(),
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().min(0).required(),
});

export const addOrderSchema = Joi.object({
  userId: objectIdSchema.optional(),

  restaurantId: objectIdSchema.optional(),

  items: Joi.array()
    .items(orderItemSchema)
    .min(1)
    .required(),

  deliveryAddress: Joi.string()
    .trim()
    .min(5)
    .required(),

  phoneNumber: Joi.string()
    .trim()
    .min(7)
    .max(20)
    .required(),

  deliveryLocation: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }).optional(),

  subtotal: Joi.number()
    .min(0)
    .required(),

  deliveryFee: Joi.number()
    .min(0)
    .required(),

  totalAmount: Joi.number()
    .min(0)
    .required(),

  paymentMethod: Joi.string()
    .valid(...Object.values(PaymentMethod))
    .default(PaymentMethod.CASH),

  notes: Joi.string()
    .trim()
    .max(500)
    .optional(),
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(OrderStatus))
    .required(),
});

export const assignDriverSchema = Joi.object({
  driverId: objectIdSchema.required(),

  estimatedDeliveryTime: Joi.date()
    .iso()
    .optional(),
});

export const updatePaymentSchema = Joi.object({
  paymentStatus: Joi.string()
    .valid(...Object.values(PaymentStatus))
    .required(),

  paymentMethod: Joi.string()
    .valid(...Object.values(PaymentMethod))
    .optional(),
});