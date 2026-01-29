const express = require('express');
const mapRoute = require('./map.route');
const bearRoute = require('./bear.route');
const healthRoute = require('./health.route');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/map',
        route: mapRoute,
    },
    {
        path: '/bears',
        route: bearRoute,
    },
    {
        path: '/health',
        route: healthRoute,
    }
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;