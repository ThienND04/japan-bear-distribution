const z = require('zod');

/**
 * Validation schema for bear search endpoint
 * @type {Object}
 * @property {import('zod').ZodObject} query - Query parameter schema
 */
const searchBear = {
    query: z.object({
        q: z.string(),
        year: z.coerce.number().int().optional(),
        lang: z.string().optional(),
        page: z.coerce.number().int().positive().optional(),
        limit: z.coerce.number().int().positive().optional(),
    }),
};

/**
 * Validation schema for H3 spatial aggregation endpoint
 * Validates geographic bounding box and H3 resolution parameters
 * @type {Object}
 * @property {import('zod').ZodObject} query - Query parameter schema
 */
const countBearInRange = {
    query: z.object({
        year: z.coerce.number().int().optional(),
        minLat: z.coerce.number().min(-90).max(90),
        maxLat: z.coerce.number().min(-90).max(90),
        minLng: z.coerce.number().min(-180).max(180),
        maxLng: z.coerce.number().min(-180).max(180),
        resolution: z.coerce.number().int().min(0).max(15),
    }),
};

/**
 * Validation schema for getting bear details by ID
 * @type {Object}
 * @property {import('zod').ZodObject} params - URL parameter schema
 * @property {import('zod').ZodObject} query - Query parameter schema
 */
const getBearDetail = {
    params: z.object({
        id: z.coerce.number().int(),
    }),
    query: z.object({
        lang: z.string().optional(),
    }),
};

module.exports = {
    searchBear,
    countBearInRange,
    getBearDetail,
};
