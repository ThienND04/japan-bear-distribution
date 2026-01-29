/**
 * @fileoverview Health check controller for monitoring system status
 * @module controllers/health.controller
 */

const catchAsync = require("../utils/catchAsync");
const httpStatus = require('http-status');
const db = require('../config/postgres');

/**
 * Health check endpoint to verify database connectivity
 * @route GET /api/v1/health
 * @returns {Promise<Object>} Health status with timestamp
 */
const healthCheck = catchAsync(async (req, res) => {
    const result = await db.query('SELECT NOW()');
    res.status(httpStatus.default.OK).send({
      status: 'OK',
      message: 'Database connection is healthy',
      time: result.rows[0].now
    });
});

module.exports = {
    healthCheck,
};