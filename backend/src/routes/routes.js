const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const prisma = new PrismaClient();
const router = express.Router();

router.use(auth);

// GET all routes
router.get('/', async (req, res) => {
  try {
    const routes = await prisma.route.findMany();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
});

// GET route by ID
router.get('/:id', async (req, res) => {
  try {
    const route = await prisma.route.findUnique({ where: { id: Number(req.params.id) } });
    if (!route) return res.status(404).json({ error: 'Route not found' });
    res.json(route);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch route' });
  }
});

// CREATE route
router.post('/', async (req, res) => {
  try {
    const { routeId, distanceKm, trafficLevel, baseTimeMinutes } = req.body;
    const route = await prisma.route.create({
      data: {
        routeId,
        distanceKm: Number(distanceKm),
        trafficLevel,
        baseTimeMinutes: Number(baseTimeMinutes)
      }
    });
    res.json(route);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create route' });
  }
});

// UPDATE route
router.put('/:id', async (req, res) => {
  try {
    const route = await prisma.route.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });
    res.json(route);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update route' });
  }
});

// DELETE route
router.delete('/:id', async (req, res) => {
  try {
    await prisma.route.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Route deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete route' });
  }
});

module.exports = router;
