const express = require('express');
const healthController = require('../../controllers/health.controller');

const router = express.Router();

router.get('/', healthController.healthCheck);

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: System health monitoring
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check system health and database connectivity
 *     tags: [Health]
 *     responses:
 *       "200":
 *         description: System is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: Database connection is healthy
 *                 time:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-01-29T10:30:00.000Z
 *       "500":
 *         description: System is unhealthy
 */

module.exports = router;