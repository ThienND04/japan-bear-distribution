const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi")

dotenv.config({ path: path.join(__dirname, "../../.env") });

/**
 * Joi validation schema for environment variables
 * Ensures all required configuration is present and valid
 * @type {import('joi').ObjectSchema}
 */
const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
        PORT: Joi.number().default(3000),
        POSTGRES_USER: Joi.string().description("user for postgres database"),
        POSTGRES_PASSWORD: Joi.string().description("password for postgres database"),
        GEOSERVER_URL: Joi.string(),
    })
    .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

/**
 * Validated and typed configuration object
 * @type {Object}
 * @property {string} env - Current environment (development/production/test)
 * @property {number} port - Server port number
 */
module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
}