const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function loadCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

async function main() {
  // Seed Drivers
  const drivers = await loadCSV('./data/drivers.csv');
  for (const d of drivers) {
    await prisma.driver.create({
      data: {
        name: d.name,
        currentShiftHours: parseInt(d.currentShiftHours),
        past7DayHours: parseInt(d.past7DayHours)
      }
    });
  }

  // Seed Routes
  const routes = await loadCSV('./data/routes.csv');
  for (const r of routes) {
    await prisma.route.create({
      data: {
        routeId: r.routeId,
        distanceKm: parseFloat(r.distanceKm),
        trafficLevel: r.trafficLevel,
        baseTimeMinutes: parseInt(r.baseTimeMinutes)
      }
    });
  }

  // Seed Orders
  const orders = await loadCSV('./data/orders.csv');
  for (const o of orders) {
    await prisma.order.create({
      data: {
        orderId: o.orderId,
        valueRs: parseFloat(o.valueRs),
        deliveryTimeMinutes: parseInt(o.deliveryTimeMinutes),
        deliveredAt: new Date(),
        routeId: parseInt(o.routeId)
      }
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
