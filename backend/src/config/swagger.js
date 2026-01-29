const swaggerJsdoc = require('swagger-jsdoc');

/**
 * Swagger JSDoc configuration options
 * Scans route files for JSDoc comments to generate API documentation
 * @type {Object}
 */
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'GIS Map API Documentation',
            version: '1.0.0',
            description: 'API tài liệu cho dự án Web GIS (Node.js + GeoServer + PostGIS)',
        },
        servers: [
            {
                url: 'http://localhost:4000/api/v1',
                description: 'Development Server',
            },
        ],
    },
    apis: ['./src/routes/v1/*.js'],
};

/**
 * Generated OpenAPI specification object for use with swagger-ui-express
 * @type {Object}
 */
const specs = swaggerJsdoc(options);
module.exports = specs;