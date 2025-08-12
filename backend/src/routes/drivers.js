const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const prisma = new PrismaClient();
const router = express.Router();

router.use(auth);

// GET all drivers
router.get('/', async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany();
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
});

// GET driver by ID
router.get('/:id', async (req, res) => {
  try {
    const driver = await prisma.driver.findUnique({ where: { id: Number(req.params.id) } });
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch driver' });
  }
});

// CREATE driver
router.post('/', async (req, res) => {
  try {
    const { name, currentShiftHours, past7DayHours } = req.body;
    const driver = await prisma.driver.create({
      data: {
        name,
        currentShiftHours: Number(currentShiftHours),
        past7DayHours: Number(past7DayHours)
      }
    });
    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create driver' });
  }
});

// UPDATE driver
router.put('/:id', async (req, res) => {
  try {
    const driver = await prisma.driver.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });
    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update driver' });
  }
});

// DELETE driver
router.delete('/:id', async (req, res) => {
  try {
    await prisma.driver.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Driver deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete driver' });
  }
});

module.exports = router;
