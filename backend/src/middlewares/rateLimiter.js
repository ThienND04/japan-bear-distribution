/**
 * @fileoverview Rate limiting middleware to prevent API abuse
 * @module middlewares/rateLimiter
 */

const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for authentication endpoints
 * Limits to 20 requests per 15 minutes, only counts failed requests
 * @type {import('express-rate-limit').RateLimitRequestHandler}
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    skipSuccessfulRequests: true,
});

/**
 * General API rate limiter
 * Limits to 300 requests per minute for all endpoints
 * @type {import('express-rate-limit').RateLimitRequestHandler}
 */
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 300,
    message: { 
        status: 429, 
        message: "Bạn thao tác quá nhanh, vui lòng thử lại sau 1 phút." 
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    authLimiter,
    apiLimiter,
};