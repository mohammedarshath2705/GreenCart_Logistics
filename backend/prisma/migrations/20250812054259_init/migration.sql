-- CreateTable
CREATE TABLE "public"."Driver" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "currentShiftHours" INTEGER NOT NULL,
    "past7DayHours" INTEGER NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Route" (
    "id" SERIAL NOT NULL,
    "routeId" TEXT NOT NULL,
    "distanceKm" DOUBLE PRECISION NOT NULL,
    "trafficLevel" TEXT NOT NULL,
    "baseTimeMinutes" INTEGER NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" SERIAL NOT NULL,
    "orderId" TEXT NOT NULL,
    "valueRs" DOUBLE PRECISION NOT NULL,
    "deliveryTimeMinutes" INTEGER NOT NULL,
    "deliveredAt" TIMESTAMP(3) NOT NULL,
    "driverId" INTEGER,
    "routeId" INTEGER,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SimulationHistory" (
    "id" SERIAL NOT NULL,
    "totalProfit" DOUBLE PRECISION NOT NULL,
    "efficiencyScore" DOUBLE PRECISION NOT NULL,
    "onTimeCount" INTEGER NOT NULL,
    "lateCount" INTEGER NOT NULL,
    "fuelCostHigh" DOUBLE PRECISION NOT NULL,
    "fuelCostLow" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SimulationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Route_routeId_key" ON "public"."Route"("routeId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderId_key" ON "public"."Order"("orderId");

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "public"."Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "public"."Route"("id") ON DELETE SET NULL ON UPDATE CASCADE;
