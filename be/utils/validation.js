import Joi from "joi";

export const increaseProductQuantitySchema = Joi.object({
    userId: Joi.string().required(),
    productId: Joi.string().required(),
});

export const decreaseProductQuantitySchema = Joi.object({
    userId: Joi.string().required(),
    productId: Joi.string().required(),
});
export const userIdParamSchema = Joi.object({
    userId: Joi.string().required(),
});

export const addItemToCartSchema = Joi.object({
    userId: Joi.string().required(),
    productId: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
});
