// src/routes/simulation.js
const express = require('express');
const { runSimulation,getLatestSimulation } = require('../controllers/simulation.controller');
const auth = require('../middleware/auth'); 
const router = express.Router();

router.post('/run', auth, runSimulation); 
router.get("/latest", getLatestSimulation);// require auth OR remove 'auth' to allow public
module.exports = router;
