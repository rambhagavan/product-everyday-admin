const express = require('express')

const router = express.Router();
const config = require('../core/configs')
const logger = require('../core/logger')

const routes = require('./api/index')

const { apiURL } = config.app;

const api = `/${apiURL}`;

// api routes
router.use(api, routes);
router.use(api, (req, res) => res.status(404).json('No API route found'));

module.exports = router;
