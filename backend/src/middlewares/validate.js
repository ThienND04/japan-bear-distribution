/**
 * @fileoverview Request validation middleware using Zod schemas
 * @module middlewares/validate
 */

/**
 * Validate Express request parameters, query, and body against Zod schemas
 * Parses and validates req.params, req.query, and req.body if schemas provided
 * @param {Object} schema - Validation schema object
 * @param {import('zod').ZodSchema} [schema.params] - Schema for URL parameters
 * @param {import('zod').ZodSchema} [schema.query] - Schema for query string
 * @param {import('zod').ZodSchema} [schema.body] - Schema for request body
 * @returns {Function} Express middleware function
 * @throws {ZodError} Validation error passed to next() if validation fails
 */
const validate = (schema) => (req, res, next) => {
    try {
        if (schema.params) {
            req.params = schema.params.parse(req.params);
        }
        if (schema.query) {
            req.query = schema.query.parse(req.query);
        }
        if (schema.body) {
            req.body = schema.body.parse(req.body);
        }
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = validate;