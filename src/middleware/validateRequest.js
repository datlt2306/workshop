import { AppError } from "../utils/appError"

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: false,
    })

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join("; ")
      return next(new AppError(errorMessage, 400))
    }

    next()
  }
}

