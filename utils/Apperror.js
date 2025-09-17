export class AppError extends Error {
    constructor(statusCode,message,details=null) {
        super(message);

        this.statusCode = statusCode;
        this.message = message;
        this.details = details;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
