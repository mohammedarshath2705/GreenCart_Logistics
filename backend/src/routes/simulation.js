// src/routes/simulation.js
const express = require('express');
const { runSimulation } = require('../controllers/simulation.controller');
const auth = require('../middleware/auth'); 
const router = express.Router();

router.post('/run', auth, runSimulation); // require auth OR remove 'auth' to allow public
module.exports = router;
