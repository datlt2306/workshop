import { AppError } from "../utils/appError";
import { StatusCodes } from "http-status-codes";

export const validateRequest = (schema, target = "body") => {
    return (req, res, next) => {
        const { error } = schema.validate(req[target], {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const errorMessages = error.details.map((detail) => detail.message).join(", ");
            return next(new AppError(errorMessages, StatusCodes.BAD_REQUEST));
        }

        // Nếu req[target] được validate, tiếp tục
        next();
    };
};
