const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const prisma = new PrismaClient();
const router = express.Router();

router.use(auth);

// GET all orders (with driver and route info)
router.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { driver: true, route: true }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(req.params.id) },
      include: { driver: true, route: true }
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// CREATE order
router.post('/', async (req, res) => {
  try {
    const { orderId, valueRs, deliveryTimeMinutes, deliveredAt, routeId, driverId } = req.body;
    const order = await prisma.order.create({
      data: {
        orderId,
        valueRs: Number(valueRs),
        deliveryTimeMinutes: Number(deliveryTimeMinutes),
        deliveredAt: deliveredAt ? new Date(deliveredAt) : new Date(),
        routeId: routeId ? Number(routeId) : null,
        driverId: driverId ? Number(driverId) : null
      }
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// UPDATE order
router.put('/:id', async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.deliveredAt) data.deliveredAt = new Date(data.deliveredAt);
    const order = await prisma.order.update({
      where: { id: Number(req.params.id) },
      data
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// DELETE order
router.delete('/:id', async (req, res) => {
  try {
    await prisma.order.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

module.exports = router;
