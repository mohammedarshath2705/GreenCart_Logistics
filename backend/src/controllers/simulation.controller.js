// src/controllers/simulation.controller.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Helper: validate HH:MM format (24-hour)
 */
function isValidTimeHHMM(t) {
  return /^[0-2]\d:[0-5]\d$/.test(t);
}

/**
 * Main simulation controller
 */
exports.runSimulation = async (req, res) => {
  try {
    const { driversCount, startTime, maxHours } = req.body;

    // --- Validate inputs ---
    if (driversCount === undefined || startTime === undefined || maxHours === undefined) {
      return res.status(400).json({ error: 'Missing parameters. Required: driversCount, startTime, maxHours' });
    }

    if (!Number.isInteger(driversCount) || driversCount <= 0) {
      return res.status(400).json({ error: 'driversCount must be a positive integer' });
    }

    if (typeof maxHours !== 'number' && !Number.isInteger(maxHours)) {
      // allow numbers like 8 or 8.5
      return res.status(400).json({ error: 'maxHours must be a number' });
    }

    if (!isValidTimeHHMM(startTime)) {
      return res.status(400).json({ error: 'startTime must be in HH:MM 24-hour format (e.g. "08:00")' });
    }

    // Fetch drivers, routes and orders
    const allDrivers = await prisma.driver.findMany();
    if (driversCount > allDrivers.length) {
      return res.status(400).json({ error: `driversCount (${driversCount}) exceeds available drivers (${allDrivers.length})` });
    }

    // Choose drivers to use in simulation:
    // heuristic: pick drivers with least past7DayHours (more rested)
    const chosenDrivers = [...allDrivers]
      .sort((a, b) => (a.past7DayHours || 0) - (b.past7DayHours || 0))
      .slice(0, driversCount)
      .map(d => ({
        id: d.id,
        name: d.name,
        currentShiftHours: Number(d.currentShiftHours || 0),
        past7DayHours: Number(d.past7DayHours || 0),
      }));

    // initialize workload tracking in minutes
    const workloadMinutes = {};
    chosenDrivers.forEach(d => workloadMinutes[d.id] = 0);

    // fetch orders with route relation
    const orders = await prisma.order.findMany({ include: { route: true, driver: true } });

    // prepare KPI accumulators
    let totalProfit = 0;
    let onTimeCount = 0;
    let lateCount = 0;
    let fuelCostHigh = 0;
    let fuelCostLow = 0;
    let assignedCount = 0;
    const orderResults = []; // optional per-order detail

    // For each order, try to assign to driver with least workload that can fit
    for (const order of orders) {
      const route = order.route;
      if (!route) {
        // skip or treat as unassigned late with zero fuel cost
        lateCount++;
        const penalty = 50;
        totalProfit += (Number(order.valueRs || 0) - penalty);
        orderResults.push({ orderId: order.orderId, assignedTo: null, reason: 'no-route', onTime: false });
        continue;
      }

      const baseTimeMin = Number(route.baseTimeMinutes || 0); // base route time in minutes
      const distanceKm = Number(route.distanceKm || 0);
      const trafficLevel = String(route.trafficLevel || 'Low');

      // find driver with minimal workload that can accept this task without exceeding maxHours
      // convert maxHours to minutes
      const maxMinutes = Number(maxHours) * 60;

      // sort chosen drivers by current assigned minutes asc
      const sortedByLoad = chosenDrivers.slice().sort((a, b) => (workloadMinutes[a.id] || 0) - (workloadMinutes[b.id] || 0));

      let assignedDriver = null;
      for (const d of sortedByLoad) {
        const current = workloadMinutes[d.id] || 0;
        if (current + baseTimeMin <= maxMinutes) {
          assignedDriver = d;
          break;
        }
      }

      // If no driver can accept within maxHours, mark as unassigned (counts late)
      if (!assignedDriver) {
        lateCount++;
        // calculate fuel cost and penalty
        let fuelCost = distanceKm * 5;
        if (trafficLevel.toLowerCase() === 'high') fuelCost += distanceKm * 2;
        if (trafficLevel.toLowerCase() === 'high') fuelCostHigh += fuelCost; else fuelCostLow += fuelCost;

        const penalty = 50;
        const value = Number(order.valueRs || 0);
        totalProfit += (value - penalty - fuelCost); // no bonus if unassigned/late
        orderResults.push({ orderId: order.orderId, assignedTo: null, onTime: false });
        continue;
      }

      // assign
      assignedCount++;
      workloadMinutes[assignedDriver.id] += baseTimeMin;

      // Determine delivery time considering fatigue rule:
      // If driver.currentShiftHours > 8 -> their speed decreases 30% (delivery time increases 30%)
      let deliveryTime = baseTimeMin;
      if (assignedDriver.currentShiftHours > 8) {
        deliveryTime = deliveryTime * 1.3;
      }

      // Check lateness against (base route time + 10)
      const allowedTime = baseTimeMin + 10;
      const isLate = deliveryTime > allowedTime;

      if (isLate) lateCount++; else onTimeCount++;

      // Penalty and bonus
      const penalty = isLate ? 50 : 0;
      const value = Number(order.valueRs || 0);
      const bonus = (!isLate && value > 1000) ? value * 0.10 : 0;

      // Fuel cost
      let fuelCost = distanceKm * 5;
      if (trafficLevel.toLowerCase() === 'high') {
        fuelCost += distanceKm * 2;
        fuelCostHigh += fuelCost;
      } else {
        fuelCostLow += fuelCost;
      }

      // Order profit
      const orderProfit = value + bonus - penalty - fuelCost;
      totalProfit += orderProfit;

      orderResults.push({
        orderId: order.orderId,
        assignedTo: assignedDriver.id,
        driverName: assignedDriver.name,
        deliveryTime: Number(deliveryTime.toFixed(2)),
        baseTimeMin,
        isLate,
        penalty,
        bonus,
        fuelCost,
        orderProfit
      });
    } // end orders loop

    const totalDeliveries = orders.length;
    const efficiencyScore = totalDeliveries === 0 ? 0 : (onTimeCount / totalDeliveries) * 100;

    // Save simulation summary
    const history = await prisma.simulationHistory.create({
      data: {
        totalProfit: Number(totalProfit.toFixed(2)),
        efficiencyScore: Number(efficiencyScore.toFixed(2)),
        onTimeCount,
        lateCount,
        fuelCostHigh: Number(fuelCostHigh.toFixed(2)),
        fuelCostLow: Number(fuelCostLow.toFixed(2)),
      }
    });

    // Return structured JSON
    return res.json({
      totalProfit: Number(totalProfit.toFixed(2)),
      efficiencyScore: Number(efficiencyScore.toFixed(2)),
      onTimeCount,
      lateCount,
      totalDeliveries,
      assignedCount,
      fuelBreakdown: { highTraffic: Number(fuelCostHigh.toFixed(2)), lowTraffic: Number(fuelCostLow.toFixed(2)) },
      savedHistoryId: history.id,
      // optional: return per-order details for frontend debugging (can remove later)
      orders: orderResults
    });

  } catch (err) {
    console.error('Simulation error:', err);
    return res.status(500).json({ error: 'Simulation failed', details: err.message });
  }
};

// src/controllers/simulation.controller.js

exports.getLatestSimulation = async (req, res) => {
  try {
    const latest = await prisma.simulationHistory.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!latest) {
      return res.status(404).json({ error: "No simulation history found" });
    }

    return res.json({
      totalProfit: latest.totalProfit,
      efficiencyScore: latest.efficiencyScore,
      onTimeCount: latest.onTimeCount,
      lateCount: latest.lateCount,
      fuelBreakdown: {
        highTraffic: latest.fuelCostHigh,
        lowTraffic: latest.fuelCostLow,
      },
    });
  } catch (err) {
    console.error("Error fetching latest simulation:", err);
    return res.status(500).json({ error: "Failed to fetch latest simulation" });
  }
};
