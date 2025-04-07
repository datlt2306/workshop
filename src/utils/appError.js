import { StatusCodes } from "http-status-codes";

export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}
