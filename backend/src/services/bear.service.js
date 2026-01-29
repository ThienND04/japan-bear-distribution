/**
 * @fileoverview Bear service layer handling business logic for bear data
 * @module services/bear.service
 */

const axios = require('axios');
const db = require('../config/postgres');
const h3 = require('h3-js');

/**
 * Get all distinct years with bear sighting data
 * @returns {Promise<Array<number>>} Array of years in descending order
 */
const getYears = async () => {
    const query = 'SELECT DISTINCT year FROM japan_bears ORDER BY year desc;';
    return db.query(query).then(res => res.rows.map(row => row.year));
};

/**
 * Search for bear sightings by keyword with pagination and language support
 * @param {string} keyword - Search keyword to match against name and description
 * @param {number} [year] - Optional year filter
 * @param {string} [lang='ja'] - Language code (ja, en, vi) for translated fields
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [limit=10] - Number of results per page
 * @returns {Promise<Array<Object>>} Array of bear records with coordinates and translations
 */
const search = async (
    keyword,
    year,
    lang = 'ja',
    page = 1,
    limit = 10
) => {
    let nameColumn = "name";
    let descColumn = "description";

    if (lang !== "ja") {
        nameColumn += `_${lang}`;
        descColumn += `_${lang}`;
    }

    const offset = (page - 1) * limit;

    let query = `
        SELECT 
            fid, 
            year, 
            ST_X(geom) as longitude, 
            ST_Y(geom) as latitude,
            ${nameColumn} as name, 
            ${descColumn} as description,
            COUNT(*) OVER() as total_count
        FROM japan_bears 
        WHERE (
            ${nameColumn} ILIKE $1 OR 
            ${descColumn} ILIKE $1
        )
    `;

    const params = [`%${keyword}%`];
    let paramIndex = 2; 

    if (year) {
        query += ` AND year = $${paramIndex++}`;
        params.push(year);
        console.log(paramIndex)
    }

    query += ` ORDER BY year desc
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    params.push(limit, offset);

    console.log("Executing Search Query:", query, "with params:", params);

    const result = await db.query(query, params);
    console.log("Search Query Result:", result.rows);
    return result.rows;
};

/**
 * Count bear sightings within a geographic bounding box using H3 spatial indexing
 * Groups bear locations into H3 hexagonal cells for efficient heatmap visualization
 * @param {number} year - Year to filter bear data
 * @param {number} minLat - Minimum latitude of bounding box
 * @param {number} maxLat - Maximum latitude of bounding box
 * @param {number} minLng - Minimum longitude of bounding box
 * @param {number} maxLng - Maximum longitude of bounding box
 * @param {number} resolution - H3 resolution level (0-15, higher = smaller cells)
 * @returns {Promise<Array<{hex: string, count: number}>>} Array of H3 cell IDs with bear counts
 */
const countInRange = async (
    year, minLat, maxLat, minLng, maxLng, resolution
) => {

    let query = `
        SELECT ST_X(geom) as lng, ST_Y(geom) as lat 
        FROM japan_bears 
        WHERE year = $1
        AND geom && ST_MakeEnvelope($2, $3, $4, $5, 4326)
    `;
    const params = [
        year,
        parseFloat(minLng),
        parseFloat(minLat),
        parseFloat(maxLng),
        parseFloat(maxLat)
    ];

    const result = await db.query(query, params);
    console.log("Search Query Result:", result.rows);

    const rawPoints = result.rows;

    const hexMap = {};
    const resLevel = parseInt(resolution); 

    rawPoints.forEach((point) => {
        const hexId = h3.latLngToCell(point.lat, point.lng, resLevel);
        hexMap[hexId] = (hexMap[hexId] || 0) + 1;
    });

    const aggregatedData = Object.entries(hexMap).map(([hex, count]) => ({
        hex,   
        count 
    }));

    return aggregatedData;
};

/**
 * Get detailed information about a specific bear sighting
 * @param {number} id - Bear record ID (fid)
 * @param {string} [lang='ja'] - Language code (ja, en, vi) for translated content
 * @returns {Promise<Object>} Bear details with coordinates and localized name/description
 */
const getBearDetail = async (id, lang = "ja") => {
    let nameColumn = "name";
    let descColumn = "description";
    if (lang !== "ja") {
        nameColumn += `_${lang}`;
        descColumn += `_${lang}`;
    }
    const query = `
        SELECT 
            fid, 
            year, 
            ST_X(geom) as longitude, 
            ST_Y(geom) as latitude,
            ${nameColumn} as name,
            ${descColumn} as description
        FROM japan_bears 
        WHERE fid = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
};

/**
 * Create a new bear record with automatic translation to multiple languages
 * @param {Object} data - Bear data object
 * @param {string} data.name - Bear name in Japanese
 * @param {string} data.description - Description in Japanese
 * @param {number} data.year - Year of sighting
 * @returns {Promise<Object>} Created bear record with translations
 */
const createBear = async (data) => {
    const translated = await translateBearData(data.name, data.description);

    const name_en = translated?.name_en || '';
    const desc_en = translated?.description_en || '';
    const name_vi = translated?.name_vi || '';
    const desc_vi = translated?.description_vi || '';

    const query = `
        INSERT INTO bears (name, description, name_en, description_en, name_vi, description_vi, year)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `;

    const values = [
        data.name,
        data.description,
        name_en, desc_en, name_vi, desc_vi,
        data.year
    ];

    const res = await db.query(query, values);
    return res.rows[0];
};


module.exports = {
    getBearYears: getYears,
    search,
    countInRange,
    getBearDetail,
    createBear
};