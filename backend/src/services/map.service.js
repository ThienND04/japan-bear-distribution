/**
 * @fileoverview Map service layer handling GeoServer integration and spatial data retrieval
 * @module services/map.service
 */

const axios = require('axios');
const db = require('../config/postgres');

/**
 * Retrieve layer data as GeoJSON from GeoServer WFS service
 * @param {string} layerName - Name of the layer in GeoServer workspace
 * @returns {Promise<Object>} GeoJSON FeatureCollection with layer features
 */
const getLayerAsGeoJSON = async (layerName) => {
    const url = `${process.env.GEOSERVER_URL}/${process.env.WORKSPACE}/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${process.env.WORKSPACE}:${layerName}&outputFormat=application/json`;
    const response = await axios.get(url);
    return response.data;
};

/**
 * Fetch vector tile (MVT/PBF) from GeoServer tile cache for efficient map rendering
 * Converts XYZ tile coordinates to TMS format (flipped Y-axis) for GeoServer compatibility
 * @param {string} layerName - Name of the layer in GeoServer workspace
 * @param {number} z - Zoom level (0-22)
 * @param {number} x - Tile column (X coordinate)
 * @param {number} y - Tile row (Y coordinate in XYZ scheme)
 * @returns {Promise<Buffer>} Binary protocol buffer tile data
 */
const getTile = async (layerName, z, x, y) => {
    // đảo ngược trục Y
    const tmsY = (1 << z) - y - 1;
    const url = `${process.env.GEOSERVER_URL}/gwc/service/tms/1.0.0/${process.env.WORKSPACE}:${layerName}@EPSG:900913@pbf/${z}/${x}/${tmsY}.pbf`;
    console.log("Fetching tile from URL:", url);
    const response = await axios.get(url, 
        { 
            responseType: 'arraybuffer',
            decompress: false,
            headers: {
                'Accept-Encoding': 'identity', 
                'User-Agent': 'Node.js Proxy'
            }
        });
    return response.data;
};


module.exports = {
    getLayerAsGeoJSON,
    getTile,
};
