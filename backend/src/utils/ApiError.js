/**
 * Custom error class for API errors with HTTP status codes
 * Extends native Error class to include statusCode and operational flag
 * @class ApiError
 * @extends Error
 */
class ApiError extends Error {
    /**
     * Create an API Error
     * @param {number} statusCode - HTTP status code (e.g., 400, 404, 500)
     * @param {string} message - Error message to display
     * @param {boolean} [isOperational=true] - Whether error is operational (expected) or programming error
     * @param {string} [stack=''] - Optional stack trace override
     */
    constructor(statusCode, message, isOperational = true, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

module.exports = ApiError;