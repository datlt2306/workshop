import Joi from "joi";

export const productSchema = Joi.object({
    name: Joi.string().min(3).required(),
    // attributes: Joi.array().items(Joi.string().hex().length(24)).required(),
    price: Joi.number().required(),
    image_url: Joi.string().uri().required(),
    quantity: Joi.number().default(1),
    description: Joi.string().optional(),
    rating: Joi.number().min(0).max(5).optional(),
    reviews: Joi.number().default(0).optional(),
    // category: Joi.string().hex().length(24).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    sku: Joi.string().required(),
    status: Joi.boolean().default(true),
});
