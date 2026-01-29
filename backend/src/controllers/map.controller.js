/**
 * @fileoverview Map controller handling GeoServer integration and spatial data
 * @module controllers/map.controller
 */

const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const mapService = require('../services/map.service');

/**
 * Get layer data as GeoJSON from GeoServer
 * @route GET /api/v1/map/layers/:layerName/geojson
 * @param {string} req.params.layerName - Name of the GeoServer layer
 * @returns {Promise<Object>} GeoJSON FeatureCollection
 */
const getLayerAsGeoJSON = catchAsync(async (req, res) => {
    const { layerName } = req.params;
    const geojsonData = await mapService.getLayerAsGeoJSON(layerName);
    res.json(geojsonData);
});

/**
 * Get vector tile (MVT/PBF) from GeoServer for efficient rendering
 * @route GET /api/v1/map/tiles/:layerName/:z/:x/:y.pbf
 * @param {string} req.params.layerName - Name of the GeoServer layer
 * @param {number} req.params.z - Zoom level
 * @param {number} req.params.x - Tile X coordinate
 * @param {number} req.params.y - Tile Y coordinate
 * @returns {Promise<Buffer>} Protocol buffer tile data
 */
const getTile = catchAsync(async (req, res) => {
    const { layerName, z, x, y } = req.params;
    const tileData = await mapService.getTile(layerName, z, x, y);
    res.setHeader('Content-Type', 'application/x-protobuf');
    res.status(httpStatus.default.OK).send(tileData);
});


module.exports = {
    getLayerAsGeoJSON,
    getTile,
};