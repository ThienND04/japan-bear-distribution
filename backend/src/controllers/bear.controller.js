const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const bearService = require('../services/bear.service');

/**
 * Get all available years with bear data
 * @route GET /api/v1/bears/years
 * @returns {Promise<Array<number>>} Array of years
 */
const getBearYears = catchAsync(async (req, res) => {
    const years = await bearService.getBearYears();
    res.json(years);
});

/**
 * Search for bears by keyword
 * @route GET /api/v1/bears/search
 * @param {string} req.query.q - Search keyword (required)
 * @param {number} [req.query.year] - Filter by year
 * @param {string} [req.query.lang='ja'] - Language code (ja, en, vi)
 * @param {number} [req.query.page=1] - Page number for pagination
 * @param {number} [req.query.limit=10] - Number of results per page
 * @returns {Promise<Array<Object>>} Search results with bear data
 */
const searchBear = catchAsync(async (req, res) => {
    const { q, year, lang, page, limit } = req.query;
    if (!q) return res.status(400).json({ message: "Thiếu từ khóa q" });
    const results = await bearService.search(q, year, lang, page, limit);
    res.json(results);
});

/**
 * Count bears within geographic bounds using H3 hexagonal spatial indexing
 * @route GET /api/v1/bears/h3
 * @param {number} req.query.year - Year to filter
 * @param {number} req.query.minLat - Minimum latitude of bounding box
 * @param {number} req.query.maxLat - Maximum latitude of bounding box
 * @param {number} req.query.minLng - Minimum longitude of bounding box
 * @param {number} req.query.maxLng - Maximum longitude of bounding box
 * @param {number} req.query.resolution - H3 resolution level (0-15)
 * @returns {Promise<Array<{hex: string, count: number}>>} Array of H3 cells with bear counts
 */
const countBearInRange = catchAsync(async (req, res) => {
    console.log("countBearInRange called with query:", req.query);
    const { year, minLat, maxLat, minLng, maxLng, resolution } = req.query;
    const results = await bearService.countInRange(year, minLat, maxLat, minLng, maxLng, resolution);
    res.json(results);
});

/**
 * Get detailed information about a specific bear
 * @route GET /api/v1/bears/:id
 * @param {number} req.params.id - Bear ID (fid)
 * @param {string} [req.query.lang='ja'] - Language code (ja, en, vi)
 * @returns {Promise<Object>} Bear details including coordinates and translated content
 */
const getBearDetail = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { lang } = req.query;
    const bearDetail = await bearService.getBearDetail(id, lang);
    res.json(bearDetail);
});

module.exports = {
    getBearYears,
    countBearInRange,
    searchBear,
    getBearDetail
}