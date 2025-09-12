// middlewares/errorHandler.js
export const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);

    // If error is operational (AppError), use its status & message
    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : "Internal Server Error";
    

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        details:err.details,
        // Only show stack trace in development (not in production)
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};
